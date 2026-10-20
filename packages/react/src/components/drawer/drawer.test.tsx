import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Drawer, DrawerClose } from './drawer'

const footer = (
  <>
    <DrawerClose asChild>
      <button type="button">Cancelar</button>
    </DrawerClose>
    <button type="button">Salvar</button>
  </>
)

describe('Drawer', () => {
  it('não mostra nada fechado, e abre pelo trigger', async () => {
    render(
      <Drawer title="Filtros" trigger={<button type="button">Abrir</button>}>
        Conteúdo
      </Drawer>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    expect(await screen.findByRole('dialog', { name: 'Filtros' })).toBeInTheDocument()
  })

  it('mostra título, corpo e descrição acessível', () => {
    render(
      <Drawer open title="Filtros">
        Escolha os filtros.
      </Drawer>,
    )
    expect(screen.getByRole('dialog', { name: 'Filtros' })).toHaveAccessibleDescription(
      'Escolha os filtros.',
    )
  })

  it.each([
    ['right', 'iu:right-0', 'iu:border-l'],
    ['left', 'iu:left-0', 'iu:border-r'],
    ['top', 'iu:top-0', 'iu:border-b'],
    ['bottom', 'iu:bottom-0', 'iu:border-t'],
  ] as const)('side %s gruda na borda certa', (side, edge, border) => {
    render(
      <Drawer open title="T" side={side}>
        x
      </Drawer>,
    )
    expect(screen.getByRole('dialog')).toHaveClass(edge, border)
  })

  it('abre pela direita por padrão', () => {
    render(
      <Drawer open title="T">
        x
      </Drawer>,
    )
    expect(screen.getByRole('dialog')).toHaveClass('iu:right-0')
  })

  it('o × fecha e o nome acessível dele é configurável', async () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open onOpenChange={onOpenChange} title="T" closeLabel="Dispensar">
        x
      </Drawer>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Dispensar' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('Esc fecha o painel', async () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open onOpenChange={onOpenChange} title="T">
        x
      </Drawer>,
    )
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renderiza o rodapé só com footer, e o DrawerClose fecha', async () => {
    const { rerender } = render(
      <Drawer defaultOpen title="T">
        x
      </Drawer>,
    )
    expect(screen.queryByRole('button', { name: 'Salvar' })).not.toBeInTheDocument()
    rerender(
      <Drawer defaultOpen title="T" footer={footer}>
        x
      </Drawer>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('prende o foco dentro do painel enquanto aberto', async () => {
    render(
      <>
        <button type="button">Fora</button>
        <Drawer open title="T" footer={footer}>
          x
        </Drawer>
      </>,
    )
    const dialog = screen.getByRole('dialog')
    for (let i = 0; i < 6; i++) {
      await userEvent.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
  })

  it('não tem violações de acessibilidade', async () => {
    render(
      <Drawer open title="Filtros" footer={footer}>
        Conteúdo
      </Drawer>,
    )
    expect(await axe(document.body)).toHaveNoViolations()
  })

  it('o backdrop é o mesmo do Modal: surface/overlay com blur de 16px', () => {
    render(
      <Drawer open title="T">
        x
      </Drawer>,
    )
    const backdrop = document.querySelector('[data-state="open"].iu\\:backdrop-blur-\\[16px\\]')
    expect(backdrop).toBeInTheDocument()
    expect(backdrop?.className).toContain('var(--color-surface-overlay)')
  })

  describe('arrastar para fechar (toque)', () => {
    // jsdom não faz layout: o painel mede 400px nos dois eixos.
    beforeEach(() => {
      // cada leitura do relógio avança 1s: os gestos dos testes são lentos, salvo onde dito
      let t = 0
      vi.spyOn(performance, 'now').mockImplementation(() => (t += 1000))
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400)
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400)
    })
    afterEach(() => vi.restoreAllMocks())

    // o react-remove-scroll do Radix lê `changedTouches`, então os dois precisam existir
    const at = (x: number, y: number) => ({
      touches: [{ clientX: x, clientY: y }],
      changedTouches: [{ clientX: x, clientY: y }],
    })
    function swipe(el: HTMLElement, from: [number, number], to: [number, number]) {
      fireEvent.touchStart(el, at(...from))
      fireEvent.touchMove(el, at(...to))
      fireEvent.touchEnd(el)
    }

    it.each([
      ['right', [100, 300], [300, 300]],
      ['left', [300, 300], [100, 300]],
      ['bottom', [200, 100], [200, 300]],
      ['top', [200, 300], [200, 100]],
    ] as const)('arrastar além de 40%% para a borda de %s fecha', async (side, from, to) => {
      render(
        <Drawer open={undefined} defaultOpen side={side} title="Filtros">
          Conteúdo
        </Drawer>,
      )
      swipe(screen.getByRole('dialog'), [...from], [...to])
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })

    it('chama onOpenChange(false) no modo controlado', () => {
      const onOpenChange = vi.fn()
      render(
        <Drawer open onOpenChange={onOpenChange} title="Filtros">
          Conteúdo
        </Drawer>,
      )
      swipe(screen.getByRole('dialog'), [100, 300], [300, 300])
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('o painel acompanha o dedo enquanto arrasta, e volta ao lugar se soltar antes do limite', () => {
      render(
        <Drawer open title="Filtros">
          Conteúdo
        </Drawer>,
      )
      const dialog = screen.getByRole('dialog')
      fireEvent.touchStart(dialog, at(100, 300))
      fireEvent.touchMove(dialog, at(150, 300))
      expect(dialog.style.translate).toBe('50px 0')
      fireEvent.touchEnd(dialog)
      expect(dialog.style.translate).toBe('')
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('um gesto rápido fecha mesmo curto', () => {
      const onOpenChange = vi.fn()
      const now = vi.mocked(performance.now)
      render(
        <Drawer open onOpenChange={onOpenChange} title="Filtros">
          Conteúdo
        </Drawer>,
      )
      const dialog = screen.getByRole('dialog')
      now.mockReturnValue(1000)
      fireEvent.touchStart(dialog, at(100, 300))
      now.mockReturnValue(1040)
      fireEvent.touchMove(dialog, at(150, 300)) // 50px em 40ms = 1.25 px/ms, só 12% do painel
      fireEvent.touchEnd(dialog)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('ignora o arraste no sentido contrário ao de fechar, e o vertical num painel lateral', () => {
      const onOpenChange = vi.fn()
      render(
        <Drawer open onOpenChange={onOpenChange} title="Filtros">
          Conteúdo
        </Drawer>,
      )
      const dialog = screen.getByRole('dialog')
      swipe(dialog, [300, 300], [100, 300])
      swipe(dialog, [100, 100], [100, 380])
      expect(onOpenChange).not.toHaveBeenCalled()
      expect(dialog.style.translate).toBe('')
    })

    it('não arrasta a partir de um campo de texto', () => {
      const onOpenChange = vi.fn()
      render(
        <Drawer open onOpenChange={onOpenChange} title="Filtros">
          <input aria-label="Nome" />
        </Drawer>,
      )
      swipe(screen.getByLabelText('Nome'), [100, 300], [380, 300])
      expect(onOpenChange).not.toHaveBeenCalled()
    })

    it('o backdrop clareia junto com o painel e volta se o gesto não fecha', () => {
      render(
        <Drawer open title="Filtros">
          Conteúdo
        </Drawer>,
      )
      const dialog = screen.getByRole('dialog')
      const backdrop = document.querySelector(
        '[data-state="open"].iu\\:backdrop-blur-\\[16px\\]',
      ) as HTMLElement
      fireEvent.touchStart(dialog, at(100, 300))
      fireEvent.touchMove(dialog, at(200, 300)) // 100px de 400
      expect(backdrop.style.opacity).toBe('0.75')
      fireEvent.touchEnd(dialog)
      expect(backdrop.style.opacity).toBe('')
    })

    describe('conteúdo que rola no eixo do arraste', () => {
      function setup() {
        const onOpenChange = vi.fn()
        render(
          <Drawer open onOpenChange={onOpenChange} title="Filtros">
            <div data-testid="scroller" style={{ overflowX: 'auto' }}>
              largo
            </div>
          </Drawer>,
        )
        const scroller = screen.getByTestId('scroller')
        for (const [prop, value] of [
          ['scrollLeft', 50],
          ['scrollWidth', 500],
          ['clientWidth', 100],
        ] as const)
          Object.defineProperty(scroller, prop, { value, writable: true, configurable: true })
        return { scroller, dialog: screen.getByRole('dialog'), onOpenChange }
      }

      it('rola o conteúdo em vez de arrastar enquanto ele ainda rola no sentido de fechar', () => {
        const { scroller, dialog } = setup()
        fireEvent.touchStart(scroller, at(100, 300))
        fireEvent.touchMove(scroller, at(160, 300))
        expect(dialog.style.translate).toBe('')
      })

      it('quando o conteúdo chega ao começo no mesmo gesto, o painel assume dali', () => {
        const { scroller, dialog, onOpenChange } = setup()
        fireEvent.touchStart(scroller, at(100, 300))
        fireEvent.touchMove(scroller, at(120, 300)) // rolando
        expect(dialog.style.translate).toBe('')
        scroller.scrollLeft = 0 // o navegador rolou até o começo
        fireEvent.touchMove(scroller, at(130, 300)) // o painel assume aqui: deslocamento 0
        fireEvent.touchMove(scroller, at(160, 300))
        expect(dialog.style.translate).toBe('30px 0')
        fireEvent.touchEnd(scroller)
        expect(onOpenChange).not.toHaveBeenCalled() // 30px de 400: volta
        expect(dialog.style.translate).toBe('')
      })

      it('se o dedo recua além do ponto em que o painel assumiu, volta ao conteúdo', () => {
        const { scroller, dialog } = setup()
        fireEvent.touchStart(scroller, at(100, 300))
        fireEvent.touchMove(scroller, at(120, 300))
        scroller.scrollLeft = 0
        fireEvent.touchMove(scroller, at(130, 300))
        fireEvent.touchMove(scroller, at(170, 300))
        expect(dialog.style.translate).toBe('40px 0')
        fireEvent.touchMove(scroller, at(110, 300)) // recuou além da origem (130)
        expect(dialog.style.translate).toBe('')
      })
    })

    it('swipeToClose={false} desliga o gesto', () => {
      const onOpenChange = vi.fn()
      render(
        <Drawer open onOpenChange={onOpenChange} swipeToClose={false} title="Filtros">
          Conteúdo
        </Drawer>,
      )
      swipe(screen.getByRole('dialog'), [100, 300], [380, 300])
      expect(onOpenChange).not.toHaveBeenCalled()
    })
  })
})
