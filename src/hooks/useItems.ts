import { useState } from "react";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { ItemData } from "../models/ItemData";
import data from "../items/data.json";
import { toNano } from "ton-core";

export function useItems() {
  const [liked, setLiked] = useState<ItemData[]>([]);
  const [available, setAvailable] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useAsyncInitialize(async () => {
    //TODO: request server to retrieve items

    setAvailable(
      data.map((x) => {
        return new ItemData(
          x.description,
          toNano(x.amountToHelp),
          toNano(x.tonAmount),
          x.title,
          x.imageUrl,
          toNano(x.id)
        );
      })
    );
  }, []);

  return { available, liked };
}
