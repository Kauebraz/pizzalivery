import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button/Button";
import { Layout } from "../../components/layout/Layout";
import { routes } from "../../routes";
import OrderContext from "../../contexts/OrderContext";
import Mussarela from "../../assets/pizza-flavours/mucarela.png";
import ChickenWithCheese from "../../assets/pizza-flavours/frango-catupiry.png";
import Margherita from "../../assets/pizza-flavours/margherita.png";
import Lusa from "../../assets/pizza-flavours/portuguesa.png";
import { convertToCurrency } from "../../helpers/convertToCurrency";
import {
  FlavourActionWrapper,
  FlavourCard,
  FlavourCardDescription,
  FlavourCardImage,
  FlavourCardPrice,
  FlavourCardTitle,
  FlavourContentWrapper,
} from "./Flavours.styles";
import { Title } from "../../components/title/Title";

export default function Flavours() {
  const navigate = useNavigate();
  const { pizzaSize, pizzaFlavour, setPizzaFlavour } = useContext(OrderContext);
  const [selQuant, setSelQuant] = useState({});
  const flavoursOptions = [
    {
      id: "10",
      image: Mussarela,
      name: "Mussarela",
      description:
        "Muçarela especial fresca, finalizada com orégano e azeitonas portuguesas.",
      price: {
        "8": 71,
        "4": 35.5,
        "1": 18,
      },
    },
    {
      id: "11",
      image: ChickenWithCheese,
      name: "Frango com catupiry",
      description:
        "Peito de frango cozido, desfiado e refogado em azeite de oliva e temperos naturais, anéis de cebola sobre base de muçarela especial, bacon em cubos e Catupiry® gratinado. É finalizada com orégano.",
      price: {
        "8": 95,
        "4": 47.5,
        "1": 24,
      },
    },
    {
      id: "12",
      image: Margherita,
      name: "Margherita",
      description:
        "Muçarela especial, muçarela de búfala rasgada, fatias de tomate finalizada com folhas de manjericão orgânico e um fio de azeite aromatizado.",
      price: {
        "8": 90,
        "4": 45,
        "1": 22.5,
      },
    },
    {
      id: "13",
      image: Lusa,
      name: "Portuguesa",
      description:
        "Clássica pizza, leva presunto magro, cebola, palmito e ervilha sobre base de muçarela fresca. Finalizada com cobertura de ovos, orégano e azeitonas portuguesas.",
      price: {
        "8": 93,
        "4": 46.5,
        "1": 23.5,
      },
    },
  ];

  const getPizzaFlavour = (id) => {
    return flavoursOptions.find((flavour) => flavour.id === id);
  };

  const handleBack = () => {
    navigate(routes.pizzaSize);
  };

  const handleDecreaseClick = (event) => {
    const id = event.target.id;
    const newQuant = { ...selQuant };
    if (newQuant[id] && newQuant[id] > 0) {
      newQuant[id] -= 1;
      setSelQuant(newQuant);
    }
  };

  const handleIncreaseClick = (event) => {
    const id = event.target.id;
    const newQuant = { ...selQuant };
    newQuant[id] = (newQuant[id] || 0) + 1;
    setSelQuant(newQuant);
  };

  

  const handleNext = () => {
    const selFlavoursData = Object.keys(selQuant).reduce(
      (flavours, id) => {
        const pizzaFlavour = getPizzaFlavour(id);
        const quantity = selQuant[id];
        for (let i = 0; i < quantity; i++) {
          flavours.push(pizzaFlavour);
        }
        return flavours;
      },
      []
    );
    setPizzaFlavour(selFlavoursData);
    navigate(routes.summary);
  };

  useEffect(() => {
    if (pizzaFlavour && pizzaFlavour.length > 0) {
      const quant = {};
      pizzaFlavour.forEach((flavour) => {
        quant[flavour.id] = (quant[flavour.id] || 0) + 1;
      });
      setSelQuant(quant);
    }
  }, [pizzaFlavour]);

  return (
    <Layout>
      <Title tabIndex={0}>Agora escolha o sabor da sua pizza</Title>
      <FlavourContentWrapper>
        {flavoursOptions.map(({ id, image, name, description, price }) => (
          <FlavourCard key={id} selected={selQuant[id] > 0}>
            <FlavourCardImage src={image} alt={name} />
            <FlavourCardTitle>{name}</FlavourCardTitle>
            <FlavourCardDescription>{description}</FlavourCardDescription>
            <FlavourCardPrice>
              {convertToCurrency(price[pizzaSize[0].slices])}
            </FlavourCardPrice>
            <div>
              <Button id={id} onClick={handleDecreaseClick}>
                -
              </Button>
              {selQuant[id] || 0}
              <Button id={id} onClick={handleIncreaseClick}>
                +
              </Button>
            </div>
          </FlavourCard>
        ))}
      </FlavourContentWrapper>

      <FlavourActionWrapper>
        <Button inverse="inverse" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleNext}>Escolha os sabores</Button>
      </FlavourActionWrapper>
    </Layout>
  );
}
