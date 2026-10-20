import {
  Accordion,
  AccordionItem,
  Alert,
  Avatar,
  Badge,
  Banner,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Container,
  Divider,
  Grid,
  GridItem,
  List,
  ListItem,
  Pagination,
  Skeleton,
  Stack,
  Step,
  Stepper,
  Tab,
  TabList,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TabPanel,
  Tabs,
  Tag,
} from '@innovui/react-native'
import { useState } from 'react'
import { Body, Section } from './section'

export function Display() {
  const [page, setPage] = useState(2)
  return (
    <>
      <Section title="Status">
        <Alert status="success" title="Salvo">
          Suas alterações foram salvas.
        </Alert>
        <Alert status="error" title="Erro" onDismiss={() => {}}>
          Não foi possível concluir.
        </Alert>
        <Banner status="info">Manutenção programada para domingo.</Banner>
        <Stack direction="row" gap={2} wrap>
          <Badge status="success">Ativo</Badge>
          <Badge status="error" dot>
            Falhou
          </Badge>
          <Tag onDismiss={() => {}}>Tag</Tag>
          <Avatar name="Rafael Bogos" />
        </Stack>
      </Section>
      <Section title="Conteúdo">
        <Card>
          <Body>Conteúdo do card</Body>
        </Card>
        <Divider />
        <List divided>
          <ListItem title="Primeiro item" description="Descrição" />
          <ListItem title="Segundo item" />
        </List>
        <Skeleton className="h-4 w-48" />
        <Accordion type="single" collapsible>
          <AccordionItem value="a" title="Seção A">
            <Body>Conteúdo da seção A</Body>
          </AccordionItem>
          <AccordionItem value="b" title="Seção B">
            <Body>Conteúdo da seção B</Body>
          </AccordionItem>
        </Accordion>
      </Section>
      <Section title="Layout">
        <Container>
          <Grid columns={2} gap={2}>
            <GridItem>
              <Card>
                <Body>Item 1</Body>
              </Card>
            </GridItem>
            <GridItem>
              <Card>
                <Body>Item 2</Body>
              </Card>
            </GridItem>
            <GridItem span="full">
              <Card>
                <Body>Linha inteira</Body>
              </Card>
            </GridItem>
          </Grid>
        </Container>
      </Section>
      <Section title="Navegação">
        <Breadcrumb>
          <BreadcrumbItem onPress={() => {}}>Início</BreadcrumbItem>
          <BreadcrumbItem onPress={() => {}}>Produtos</BreadcrumbItem>
          <BreadcrumbItem current>Detalhe</BreadcrumbItem>
        </Breadcrumb>
        <Tabs defaultValue="um">
          <TabList>
            <Tab value="um">Um</Tab>
            <Tab value="dois">Dois</Tab>
          </TabList>
          <TabPanel value="um">
            <Body>Painel um</Body>
          </TabPanel>
          <TabPanel value="dois">
            <Body>Painel dois</Body>
          </TabPanel>
        </Tabs>
        <Pagination page={page} pageCount={8} onPageChange={setPage} />
        <Stepper current={1}>
          <Step>Conta</Step>
          <Step>Endereço</Step>
          <Step>Pagamento</Step>
        </Stepper>
      </Section>
      <Section title="Tabela">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Plano</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ana</TableCell>
              <TableCell>Pro</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bruno</TableCell>
              <TableCell>Free</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>
    </>
  )
}
