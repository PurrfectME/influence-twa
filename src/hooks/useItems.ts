import { useEffect, useState } from "react";
import { ItemData } from "../models/ItemData";
import { fromNano, toNano } from "ton-core";

export let initialData = [
  {
    id: 1,
    title: "Психологическая поддержка для Дмитрия Ефремова",
    description: "СУКА НА НОВУЮ БОГТАУЮ ЖИЗНБ ДАЙТЕ ДЕНЯК",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 7,
    title: "TITLE",
    description: "СУКА НА НОВУЮ БОГТАУЮ ЖИЗНБ ДАЙТЕ ДЕНЯК",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 8,
    title: "TITLE",
    description: "СУКА НА НОВУЮ БОГТАУЮ ЖИЗНБ ДАЙТЕ ДЕНЯК",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 9,
    title: "TITLE",
    description: "СУКА НА НОВУЮ БОГТАУЮ ЖИЗНБ ДАЙТЕ ДЕНЯК",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 10,
    title: "TITLE",
    description: "СУКА НА НОВУЮ БОГТАУЮ ЖИЗНБ ДАЙТЕ ДЕНЯК",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 2,
    title: "TITLE",
    description: "СУКА НА НОВУЮ БОГТАУЮ ЖИЗНБ ДАЙТЕ ДЕНЯК",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 3,
    title: "TITLE",
    description: "СУКА НА НОВУЮ БОГТАУЮ ЖИЗНБ ДАЙТЕ ДЕНЯК",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 4,
    title: "TITLE",
    description: "СУКА НА НОВУЮ БОГТАУЮ ЖИЗНБ ДАЙТЕ ДЕНЯК",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 5,
    title: "TITLE",
    description: "СУКА НА НОВУЮ БОГТАУЮ ЖИЗНБ ДАЙТЕ ДЕНЯК",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 6,
    title: "TITLE",
    description: "СУКА НА НОВУЮ БОГТАУЮ ЖИЗНБ ДАЙТЕ ДЕНЯК",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
];

if (!localStorage.getItem("items")) {
  localStorage.setItem("items", JSON.stringify(initialData));
}

export function useItems(likedIds: number[] | undefined, page: number) {
  const ITEMS_AMOUNT: number = 10;

  const [liked, setLiked] = useState<ItemData[]>([]);
  const [available, setAvailable] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageAmount, setPageAmount] = useState(1);

  useEffect(() => {
    console.log("LIKED", likedIds);

    if (!likedIds) return;

    const l: ItemData[] = [];
    const a: ItemData[] = [];
    const data: ItemData[] = JSON.parse(localStorage.getItem("items")!);
    const totalAmount = data.length - likedIds.length;
    setPageAmount(Math.ceil(totalAmount / ITEMS_AMOUNT));

    if (likedIds.length == 0) {
      data.map((item) => {
        a.push(
          new ItemData(
            item.description,
            toNano(item.amountToHelp),
            toNano(item.tonAmount),
            item.title,
            item.imageUrl,
            item.id,
            item.likes,
            item.currency
          )
        );
      });
      const end =
        a.length < page * ITEMS_AMOUNT ? a.length + 1 : page * ITEMS_AMOUNT;

      setAvailable(a.slice(page * ITEMS_AMOUNT - ITEMS_AMOUNT, end));
      setLoading(false);

      return;
    }

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (likedIds.includes(item.id)) {
        l.push(
          new ItemData(
            item.description,
            toNano(item.amountToHelp),
            toNano(item.tonAmount),
            item.title,
            item.imageUrl,
            item.id,
            item.likes,
            item.currency
          )
        );
      } else {
        a.push(
          new ItemData(
            item.description,
            toNano(item.amountToHelp),
            toNano(item.tonAmount),
            item.title,
            item.imageUrl,
            item.id,
            item.likes,
            item.currency
          )
        );
      }
    }
    setLiked(l);
    const end =
      a.length < page * ITEMS_AMOUNT ? a.length + 1 : page * ITEMS_AMOUNT;

    setAvailable(a.slice(page * ITEMS_AMOUNT - ITEMS_AMOUNT, end));
    setLoading(false);
  }, [likedIds, page]);

  return { available, liked, pageAmount, loading, setLoading };
}
