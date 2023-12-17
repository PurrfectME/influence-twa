import { useEffect, useState } from "react";
import { ItemData } from "../models/ItemData";
import { fromNano, toNano } from "ton-core";

export let initialData = [
  {
    id: 1,
    title: "TITLE",
    description: "DESCRIPTION",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 2,
    title: "TITLE",
    description: "DESCRIPTION",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 3,
    title: "TITLE",
    description: "DESCRIPTION",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 4,
    title: "TITLE",
    description: "DESCRIPTION",
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

export function useItems(likedIds: number[] | undefined) {
  const [liked, setLiked] = useState<ItemData[]>([]);
  const [available, setAvailable] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("LIKED", likedIds);

    if (!likedIds) return;
    const l: ItemData[] = [];
    const a: ItemData[] = [];
    const data: ItemData[] = JSON.parse(localStorage.getItem("items")!);

    console.log("DATA", data);

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
      setAvailable(a);
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
    setAvailable(a);

    setLoading(false);
  }, [likedIds]);

  return { available, liked, loading, setLoading };
}
