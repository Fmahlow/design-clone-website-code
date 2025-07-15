import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfilePersonalData = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dados pessoais</h1>
      
      {/* Profile picture section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl font-bold">F</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Foto do perfil</h3>
            <p className="text-sm text-muted-foreground">400px, JPG ou PNG, max 1MB</p>
            <Button variant="link" className="p-0 h-auto text-blue-500">
              Carregar imagem
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for different data sections */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="text-blue-500">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="contact">Informações de Contato</TabsTrigger>
          <TabsTrigger value="professional">Dados Profissionais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="name">Nome e sobrenome</Label>
              <Input id="name" defaultValue="Felipe Mahlow" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="birthdate">Data de nascimento</Label>
              <Input id="birthdate" placeholder="DD/MM/AAAA" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="document">Documento</Label>
              <Input id="document" placeholder="000.000.000-00" className="mt-1" />
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <Button>Editar informações</Button>
            <Button variant="outline">Alterar a senha</Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <Button variant="destructive">
              Excluir meus dados
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" defaultValue="felipe.mahlow@gmail.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(00) 00000-0000" className="mt-1" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="professional" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" placeholder="Nome da empresa" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="position">Cargo</Label>
              <Input id="position" placeholder="Seu cargo" className="mt-1" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePersonalData;