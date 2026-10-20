#!/usr/bin/env bash
# Cria a tag e o GitHub Release de cada pacote de packages/* cuja versão mudou no último commit
# (o merge do PR "Version Packages"), já foi publicada no npm e ainda não tem tag no GitHub.
# Tag no formato do Changesets (`@innovui/react@1.0.0`); as notas vêm do CHANGELOG.md do pacote.
#
# O changesets/action deveria fazer isso, mas com a CLI 3.x ele não recebe as linhas "New tag:"
# e não envia as tags nem cria releases.
#
# Env: GH_TOKEN (para o gh); BASE_REF (padrão HEAD^); DRY_RUN=1 só imprime.
set -euo pipefail

base="${BASE_REF:-HEAD^}"

for dir in packages/*/; do
  dir="${dir%/}"
  name=$(jq -r .name "$dir/package.json")
  version=$(jq -r .version "$dir/package.json")
  tag="$name@$version"
  before=$(git show "$base:$dir/package.json" 2>/dev/null | jq -r .version 2>/dev/null || true)

  [ "$before" != "$version" ] || continue # versão não mudou neste commit
  # logo depois do publish o registro pode levar alguns segundos para mostrar a versão
  published=0
  for _ in 1 2 3 4 5 6; do
    npm view "$name@$version" version >/dev/null 2>&1 && { published=1; break; }
    sleep 10
  done
  [ "$published" = 1 ] || { echo "$tag: não está no npm, pulando"; continue; }
  git ls-remote --exit-code --tags origin "refs/tags/$tag" >/dev/null 2>&1 && { echo "$tag: já tem tag"; continue; }

  # a seção `## <versão>` do CHANGELOG, sem o título
  notes=$(awk -v v="$version" '/^## /{p=($2==v); next} p' "$dir/CHANGELOG.md" 2>/dev/null || true)
  [ -n "$notes" ] || notes="Veja o [CHANGELOG]($dir/CHANGELOG.md)."

  echo "$tag: criando release"
  if [ "${DRY_RUN:-}" = 1 ]; then
    printf -- '--- gh release create %s --title %s --target %s\n%s\n---\n' "$tag" "$tag" "$(git rev-parse HEAD)" "$notes"
  else
    gh release create "$tag" --title "$tag" --notes "$notes" --target "$(git rev-parse HEAD)"
  fi
done
