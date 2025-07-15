import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

const ProfileBilling = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  const plans = [
    {
      name: "Plano Básico",
      price: 67,
      period: "Mensal",
      features: [
        "7 dias de garantia",
        "Até 1 usuários",
        "600 Diamantes",
        "Render em 40seg",
        "4 imagens simultâneas",
        "Resolução em 2K",
        "Acesso antecipado às funções beta"
      ],
      buttonText: "Escolher plano",
      buttonVariant: "outline" as const
    },
    {
      name: "Plano Expert",
      price: 147,
      period: "Mensal",
      isPopular: true,
      features: [
        "7 dias de garantia",
        "Até 1 usuários",
        "2000 Diamantes",
        "Render em 40seg",
        "8 imagens simultâneas",
        "Resolução em 4K",
        "Acesso antecipado às funções beta"
      ],
      buttonText: "Fazer upgrade",
      buttonVariant: "default" as const
    },
    {
      name: "Plano Empresarial",
      price: 427,
      period: "Mensal",
      isPremium: true,
      features: [
        "7 dias de garantia",
        "Até 3 usuários",
        "7000 Diamantes",
        "Render em 15seg",
        "16 imagens simultâneas",
        "Resolução em 4K",
        "Acesso antecipado às funções beta"
      ],
      buttonText: "Fazer upgrade",
      buttonVariant: "default" as const
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Plano e faturamento</h1>
      <p className="text-muted-foreground mb-6">Informações sobre o seu plano atual e opções de upgrade.</p>
      
      {/* Current plan status */}
      <div className="bg-muted/50 rounded-lg p-8 text-center mb-8">
        <p className="text-muted-foreground mb-4">Você ainda não possui um plano ativo</p>
        <Button className="bg-primary hover:bg-primary/90">
          Assinar um plano
        </Button>
      </div>

      {/* Plan selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Mudar plano</h3>
        
        {/* Monthly/Annual toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted rounded-full p-1 inline-flex">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedPlan === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setSelectedPlan("annual")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedPlan === "annual"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
              <span className="ml-1 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                2 meses grátis 🎁
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.isPopular ? 'border-primary border-2' : ''}`}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              {plan.isPremium && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  R$ {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant} 
                  className="w-full"
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Support section */}
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Se você tiver alguma dúvida sobre seu plano ou precisar de ajuda, entre em contato com nossa equipe de suporte.
        </p>
        <Button variant="link" className="text-primary">
          🙋‍♂️ Chamar o suporte
        </Button>
        <div className="mt-4">
          <Button variant="link" className="text-red-500">
            ❌ Cancelar assinatura
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBilling;