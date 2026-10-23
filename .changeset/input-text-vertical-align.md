---
'@innovui/react-native': patch
---

Input e busca do Combobox: no iOS o texto digitado e o placeholder ficavam mais baixos que no web. O tamanho da fonte agora não traz `line-height` (que desce o texto num `TextInput` de uma linha), então o texto fica centralizado no campo.
