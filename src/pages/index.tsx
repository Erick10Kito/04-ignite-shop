import Image from "next/image";
import { HomeContainer, Product } from "../styles/pages/home";

import { useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";
import { stripe } from "../lib/stripe";
import { GetStaticProps } from "next";
import Stripe from "stripe";

interface IHomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
  }[];
}

export default function Home({ products }: IHomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products?.map((product) => {
        return (
          <Product key={product.id} className="keen-slider__slide">
            <Image src={product.imageUrl} width={520} height={480} alt="" />

            <footer>
              <strong>{product.name} X</strong>
              <span>R$ {product.price}</span>
            </footer>
          </Product>
        );
      })}
    </HomeContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;
    const result = {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: price.unit_amount! / 100,
    };

    return result;
  });

  console.log(response);
  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2,
  };
};
