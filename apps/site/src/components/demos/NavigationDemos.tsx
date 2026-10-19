import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  SegmentedControl,
  SegmentedItem,
  Step,
  Stepper,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@innovui/react'
import { useState } from 'react'
import { Stage } from './Stage'

const Home = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 10.5 12 3l9 7.5V21H3z" />
  </svg>
)

export function TabsDemo() {
  return (
    <Stage>
      <Tabs defaultValue="geral">
        <TabList aria-label="Configurações">
          <Tab value="geral">Geral</Tab>
          <Tab value="conta">Conta</Tab>
          <Tab value="notificacoes">Notificações</Tab>
          <Tab value="faturas" disabled>
            Faturas
          </Tab>
        </TabList>
        <TabPanel value="geral" style={{ paddingTop: '1rem' }}>
          Preferências gerais do workspace.
        </TabPanel>
        <TabPanel value="conta" style={{ paddingTop: '1rem' }}>
          Dados da conta e segurança.
        </TabPanel>
        <TabPanel value="notificacoes" style={{ paddingTop: '1rem' }}>
          Canais e frequência de avisos.
        </TabPanel>
      </Tabs>
    </Stage>
  )
}

export function TabsIconDemo() {
  return (
    <Stage>
      <Tabs defaultValue="inicio">
        <TabList aria-label="Navegação">
          <Tab value="inicio" icon={<Home />}>
            Início
          </Tab>
          <Tab value="projetos" icon={<Home />}>
            Projetos
          </Tab>
        </TabList>
      </Tabs>
    </Stage>
  )
}

export function SegmentedDemo() {
  const [view, setView] = useState('lista')

  return (
    <Stage>
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}
      >
        <SegmentedControl aria-label="Visualização" value={view} onValueChange={setView}>
          <SegmentedItem value="lista">Lista</SegmentedItem>
          <SegmentedItem value="grade">Grade</SegmentedItem>
          <SegmentedItem value="mapa">Mapa</SegmentedItem>
          <SegmentedItem value="kanban" disabled>
            Kanban
          </SegmentedItem>
        </SegmentedControl>
        <span>
          Visualização atual: <strong>{view}</strong>
        </span>
      </div>
    </Stage>
  )
}

export function StepperDemo() {
  const [current, setCurrent] = useState(1)
  const steps = ['Conta', 'Endereço', 'Pagamento', 'Confirmação']

  return (
    <Stage>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          alignItems: 'flex-start',
        }}
      >
        <Stepper current={current} aria-label="Etapas do cadastro">
          {steps.map((label) => (
            <Step key={label}>{label}</Step>
          ))}
        </Stepper>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="secondary"
            size="sm"
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            Voltar
          </Button>
          <Button
            size="sm"
            disabled={current === steps.length}
            onClick={() => setCurrent(current + 1)}
          >
            {current >= steps.length - 1 ? 'Concluir' : 'Avançar'}
          </Button>
        </div>
      </div>
    </Stage>
  )
}

export function BreadcrumbDemo() {
  return (
    <Stage>
      <Breadcrumb>
        <BreadcrumbItem href="#">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="#">Configurações</BreadcrumbItem>
        <BreadcrumbItem current>Perfil</BreadcrumbItem>
      </Breadcrumb>
    </Stage>
  )
}
