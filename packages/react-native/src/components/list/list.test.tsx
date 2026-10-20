import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'
import { List, ListItem } from './list'

describe('List', () => {
  it('renderiza itens com role list/listitem', () => {
    render(
      <List testID="l">
        <ListItem testID="a" title="A" />
        <ListItem testID="b" title="B" />
      </List>,
    )
    expect(screen.getByTestId('l').props.accessibilityRole).toBe('list')
    // sem `accessible`, o RNTL não acha por role: confere a prop direto
    expect(screen.getByTestId('a').props.role).toBe('listitem')
    expect(screen.getByTestId('b').props.role).toBe('listitem')
  })

  it('divided intercala divisores entre os itens (n-1)', () => {
    const { toJSON } = render(
      <List divided>
        <ListItem title="A" />
        <ListItem title="B" />
        <ListItem title="C" />
      </List>,
    )
    expect(JSON.stringify(toJSON()).match(/bg-border-default/g)).toHaveLength(2)
  })

  it('sem divided não há divisores', () => {
    const { toJSON } = render(
      <List>
        <ListItem title="A" />
        <ListItem title="B" />
      </List>,
    )
    expect(JSON.stringify(toJSON())).not.toContain('bg-border-default')
  })
})

describe('ListItem', () => {
  it('mostra título, descrição, leading, trailing e children', () => {
    render(
      <ListItem
        title="Maria"
        description="Designer"
        leading={<Text>L</Text>}
        trailing={<Text>T</Text>}
      >
        <Text>extra</Text>
      </ListItem>,
    )
    for (const t of ['Maria', 'Designer', 'L', 'T', 'extra']) {
      expect(screen.getByText(t)).toBeTruthy()
    }
  })

  it('sem description não renderiza o texto de apoio', () => {
    render(<ListItem title="Maria" />)
    expect(screen.queryByText('Designer')).toBeNull()
    expect(screen.getByText('Maria').props.className).toContain('text-text-primary')
  })

  it('className do consumidor vence', () => {
    render(<ListItem testID="i" title="A" className="py-1" />)
    expect(screen.getByTestId('i').props.className).toContain('py-1')
    expect(screen.getByTestId('i').props.className).not.toContain('py-3')
  })
})
