import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProfileDiamonds = () => {
  const [activeTab, setActiveTab] = useState("outgoing");

  const transactions = [
    {
      date: "22/05/2025",
      description: "Pincel",
      value: 2,
      type: "outgoing"
    },
    {
      date: "02/06/2025",
      description: "Melhorar Render",
      value: 1,
      type: "outgoing"
    },
    {
      date: "02/06/2025",
      description: "Melhorar Render",
      value: 1,
      type: "outgoing"
    },
    {
      date: "02/06/2025",
      description: "Melhorar Render",
      value: 1,
      type: "outgoing"
    },
    {
      date: "02/06/2025",
      description: "Renderizar imagem",
      value: 2,
      type: "outgoing"
    },
    {
      date: "02/06/2025",
      description: "Renderizar imagem",
      value: 2,
      type: "outgoing"
    }
  ];

  const filteredTransactions = transactions.filter(transaction => 
    activeTab === "all" || transaction.type === activeTab
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Meu plano</h1>
      
      {/* Current plan status */}
      <div className="bg-muted/50 rounded-lg p-8 text-center mb-8">
        <p className="text-muted-foreground mb-4">Você ainda não possui um plano ativo</p>
        <Button className="bg-primary hover:bg-primary/90">
          Assinar um plano
        </Button>
      </div>

      {/* Transaction history */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Extrato de Transações</h3>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="outgoing" className="text-primary">Saídas</TabsTrigger>
            <TabsTrigger value="incoming">Entradas</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Lançamento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-muted-foreground">
                        {transaction.date}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span>{transaction.value}</span>
                          <span className="text-yellow-500">💎</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredTransactions.length === 0 && activeTab === "incoming" && (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma entrada encontrada
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileDiamonds;