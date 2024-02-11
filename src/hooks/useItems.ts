import { useEffect, useState } from "react";
import { ItemData } from "../models/ItemData";
import { fromNano, toNano } from "ton-core";

export let initialData = [
  {
    id: 1,
    title: "Психологическая поддержка для Дмитрия Ефремова",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum est at elit accumsan blandit. Proin semper mi sit amet orci fermentum auctor. Morbi malesuada, justo at feugiat molestie, est elit elementum neque, non auctor ligula dui efficitur libero. Nullam tristique venenatis odio vel dapibus. Fusce tincidunt in ipsum at efficitur. Curabitur rutrum elit id ultricies congue. Quisque convallis mi eu dui pharetra, quis blandit ex sodales. Pellentesque malesuada enim sit amet ultricies aliquet. Quisque volutpat vehicula tincidunt. Phasellus scelerisque, velit et tincidunt ornare, leo est eleifend velit, eu molestie sem nunc lobortis arcu. Phasellus aliquet risus eu porttitor aliquam. Nunc laoreet diam vitae nunc eleifend sagittis." +
      "Nam mollis tortor dui, fringilla facilisis orci convallis nec. Duis scelerisque molestie odio, ut gravida tellus suscipit sed. Suspendisse imperdiet dictum orci eu fringilla. Etiam consectetur, risus vel rutrum pulvinar, felis tellus sodales velit, id faucibus nibh urna a felis. Ut vitae sapien eu augue faucibus egestas. Proin luctus ac ligula eu rutrum. Donec placerat, urna eu sollicitudin congue, sapien erat ultrices arcu, nec venenatis ligula massa gravida tellus." +
      "Nunc condimentum, erat at vestibulum molestie, ante nisl consectetur lorem, viverra molestie mauris ligula eget eros. In ac urna finibus felis tempus mattis in in mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed blandit vestibulum posuere. Suspendisse enim ligula, ultrices eget condimentum in, venenatis eu turpis. Proin sapien quam, ullamcorper quis tellus quis, euismod bibendum massa. Nunc vitae efficitur nisi." +
      "Fusce commodo porttitor sapien, at eleifend justo eleifend rutrum. Nunc luctus sapien risus, id porta mauris mattis non. In auctor, diam a ultricies mattis, nisl neque volutpat elit, nec aliquam justo felis quis eros. Phasellus tristique vehicula enim, vitae tristique nulla porta ac. Integer ultrices aliquam arcu quis mollis. Nunc ac metus vitae metus bibendum pulvinar. Pellentesque maximus dignissim tellus, sed iaculis elit feugiat eu. Curabitur mi magna, scelerisque et enim eu, scelerisque scelerisque est. Nam viverra nisl arcu, ac accumsan sem blandit ut.",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 7,
    title: "TITLE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum est at elit accumsan blandit. Proin semper mi sit amet orci fermentum auctor. Morbi malesuada, justo at feugiat molestie, est elit elementum neque, non auctor ligula dui efficitur libero. Nullam tristique venenatis odio vel dapibus. Fusce tincidunt in ipsum at efficitur. Curabitur rutrum elit id ultricies congue. Quisque convallis mi eu dui pharetra, quis blandit ex sodales. Pellentesque malesuada enim sit amet ultricies aliquet. Quisque volutpat vehicula tincidunt. Phasellus scelerisque, velit et tincidunt ornare, leo est eleifend velit, eu molestie sem nunc lobortis arcu. Phasellus aliquet risus eu porttitor aliquam. Nunc laoreet diam vitae nunc eleifend sagittis." +
      "Nam mollis tortor dui, fringilla facilisis orci convallis nec. Duis scelerisque molestie odio, ut gravida tellus suscipit sed. Suspendisse imperdiet dictum orci eu fringilla. Etiam consectetur, risus vel rutrum pulvinar, felis tellus sodales velit, id faucibus nibh urna a felis. Ut vitae sapien eu augue faucibus egestas. Proin luctus ac ligula eu rutrum. Donec placerat, urna eu sollicitudin congue, sapien erat ultrices arcu, nec venenatis ligula massa gravida tellus." +
      "Nunc condimentum, erat at vestibulum molestie, ante nisl consectetur lorem, viverra molestie mauris ligula eget eros. In ac urna finibus felis tempus mattis in in mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed blandit vestibulum posuere. Suspendisse enim ligula, ultrices eget condimentum in, venenatis eu turpis. Proin sapien quam, ullamcorper quis tellus quis, euismod bibendum massa. Nunc vitae efficitur nisi." +
      "Fusce commodo porttitor sapien, at eleifend justo eleifend rutrum. Nunc luctus sapien risus, id porta mauris mattis non. In auctor, diam a ultricies mattis, nisl neque volutpat elit, nec aliquam justo felis quis eros. Phasellus tristique vehicula enim, vitae tristique nulla porta ac. Integer ultrices aliquam arcu quis mollis. Nunc ac metus vitae metus bibendum pulvinar. Pellentesque maximus dignissim tellus, sed iaculis elit feugiat eu. Curabitur mi magna, scelerisque et enim eu, scelerisque scelerisque est. Nam viverra nisl arcu, ac accumsan sem blandit ut.",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 8,
    title: "TITLE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum est at elit accumsan blandit. Proin semper mi sit amet orci fermentum auctor. Morbi malesuada, justo at feugiat molestie, est elit elementum neque, non auctor ligula dui efficitur libero. Nullam tristique venenatis odio vel dapibus. Fusce tincidunt in ipsum at efficitur. Curabitur rutrum elit id ultricies congue. Quisque convallis mi eu dui pharetra, quis blandit ex sodales. Pellentesque malesuada enim sit amet ultricies aliquet. Quisque volutpat vehicula tincidunt. Phasellus scelerisque, velit et tincidunt ornare, leo est eleifend velit, eu molestie sem nunc lobortis arcu. Phasellus aliquet risus eu porttitor aliquam. Nunc laoreet diam vitae nunc eleifend sagittis." +
      "Nam mollis tortor dui, fringilla facilisis orci convallis nec. Duis scelerisque molestie odio, ut gravida tellus suscipit sed. Suspendisse imperdiet dictum orci eu fringilla. Etiam consectetur, risus vel rutrum pulvinar, felis tellus sodales velit, id faucibus nibh urna a felis. Ut vitae sapien eu augue faucibus egestas. Proin luctus ac ligula eu rutrum. Donec placerat, urna eu sollicitudin congue, sapien erat ultrices arcu, nec venenatis ligula massa gravida tellus." +
      "Nunc condimentum, erat at vestibulum molestie, ante nisl consectetur lorem, viverra molestie mauris ligula eget eros. In ac urna finibus felis tempus mattis in in mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed blandit vestibulum posuere. Suspendisse enim ligula, ultrices eget condimentum in, venenatis eu turpis. Proin sapien quam, ullamcorper quis tellus quis, euismod bibendum massa. Nunc vitae efficitur nisi." +
      "Fusce commodo porttitor sapien, at eleifend justo eleifend rutrum. Nunc luctus sapien risus, id porta mauris mattis non. In auctor, diam a ultricies mattis, nisl neque volutpat elit, nec aliquam justo felis quis eros. Phasellus tristique vehicula enim, vitae tristique nulla porta ac. Integer ultrices aliquam arcu quis mollis. Nunc ac metus vitae metus bibendum pulvinar. Pellentesque maximus dignissim tellus, sed iaculis elit feugiat eu. Curabitur mi magna, scelerisque et enim eu, scelerisque scelerisque est. Nam viverra nisl arcu, ac accumsan sem blandit ut.",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 9,
    title: "TITLE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum est at elit accumsan blandit. Proin semper mi sit amet orci fermentum auctor. Morbi malesuada, justo at feugiat molestie, est elit elementum neque, non auctor ligula dui efficitur libero. Nullam tristique venenatis odio vel dapibus. Fusce tincidunt in ipsum at efficitur. Curabitur rutrum elit id ultricies congue. Quisque convallis mi eu dui pharetra, quis blandit ex sodales. Pellentesque malesuada enim sit amet ultricies aliquet. Quisque volutpat vehicula tincidunt. Phasellus scelerisque, velit et tincidunt ornare, leo est eleifend velit, eu molestie sem nunc lobortis arcu. Phasellus aliquet risus eu porttitor aliquam. Nunc laoreet diam vitae nunc eleifend sagittis." +
      "Nam mollis tortor dui, fringilla facilisis orci convallis nec. Duis scelerisque molestie odio, ut gravida tellus suscipit sed. Suspendisse imperdiet dictum orci eu fringilla. Etiam consectetur, risus vel rutrum pulvinar, felis tellus sodales velit, id faucibus nibh urna a felis. Ut vitae sapien eu augue faucibus egestas. Proin luctus ac ligula eu rutrum. Donec placerat, urna eu sollicitudin congue, sapien erat ultrices arcu, nec venenatis ligula massa gravida tellus." +
      "Nunc condimentum, erat at vestibulum molestie, ante nisl consectetur lorem, viverra molestie mauris ligula eget eros. In ac urna finibus felis tempus mattis in in mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed blandit vestibulum posuere. Suspendisse enim ligula, ultrices eget condimentum in, venenatis eu turpis. Proin sapien quam, ullamcorper quis tellus quis, euismod bibendum massa. Nunc vitae efficitur nisi." +
      "Fusce commodo porttitor sapien, at eleifend justo eleifend rutrum. Nunc luctus sapien risus, id porta mauris mattis non. In auctor, diam a ultricies mattis, nisl neque volutpat elit, nec aliquam justo felis quis eros. Phasellus tristique vehicula enim, vitae tristique nulla porta ac. Integer ultrices aliquam arcu quis mollis. Nunc ac metus vitae metus bibendum pulvinar. Pellentesque maximus dignissim tellus, sed iaculis elit feugiat eu. Curabitur mi magna, scelerisque et enim eu, scelerisque scelerisque est. Nam viverra nisl arcu, ac accumsan sem blandit ut.",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 10,
    title: "TITLE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum est at elit accumsan blandit. Proin semper mi sit amet orci fermentum auctor. Morbi malesuada, justo at feugiat molestie, est elit elementum neque, non auctor ligula dui efficitur libero. Nullam tristique venenatis odio vel dapibus. Fusce tincidunt in ipsum at efficitur. Curabitur rutrum elit id ultricies congue. Quisque convallis mi eu dui pharetra, quis blandit ex sodales. Pellentesque malesuada enim sit amet ultricies aliquet. Quisque volutpat vehicula tincidunt. Phasellus scelerisque, velit et tincidunt ornare, leo est eleifend velit, eu molestie sem nunc lobortis arcu. Phasellus aliquet risus eu porttitor aliquam. Nunc laoreet diam vitae nunc eleifend sagittis." +
      "Nam mollis tortor dui, fringilla facilisis orci convallis nec. Duis scelerisque molestie odio, ut gravida tellus suscipit sed. Suspendisse imperdiet dictum orci eu fringilla. Etiam consectetur, risus vel rutrum pulvinar, felis tellus sodales velit, id faucibus nibh urna a felis. Ut vitae sapien eu augue faucibus egestas. Proin luctus ac ligula eu rutrum. Donec placerat, urna eu sollicitudin congue, sapien erat ultrices arcu, nec venenatis ligula massa gravida tellus." +
      "Nunc condimentum, erat at vestibulum molestie, ante nisl consectetur lorem, viverra molestie mauris ligula eget eros. In ac urna finibus felis tempus mattis in in mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed blandit vestibulum posuere. Suspendisse enim ligula, ultrices eget condimentum in, venenatis eu turpis. Proin sapien quam, ullamcorper quis tellus quis, euismod bibendum massa. Nunc vitae efficitur nisi." +
      "Fusce commodo porttitor sapien, at eleifend justo eleifend rutrum. Nunc luctus sapien risus, id porta mauris mattis non. In auctor, diam a ultricies mattis, nisl neque volutpat elit, nec aliquam justo felis quis eros. Phasellus tristique vehicula enim, vitae tristique nulla porta ac. Integer ultrices aliquam arcu quis mollis. Nunc ac metus vitae metus bibendum pulvinar. Pellentesque maximus dignissim tellus, sed iaculis elit feugiat eu. Curabitur mi magna, scelerisque et enim eu, scelerisque scelerisque est. Nam viverra nisl arcu, ac accumsan sem blandit ut.",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 2,
    title: "TITLE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum est at elit accumsan blandit. Proin semper mi sit amet orci fermentum auctor. Morbi malesuada, justo at feugiat molestie, est elit elementum neque, non auctor ligula dui efficitur libero. Nullam tristique venenatis odio vel dapibus. Fusce tincidunt in ipsum at efficitur. Curabitur rutrum elit id ultricies congue. Quisque convallis mi eu dui pharetra, quis blandit ex sodales. Pellentesque malesuada enim sit amet ultricies aliquet. Quisque volutpat vehicula tincidunt. Phasellus scelerisque, velit et tincidunt ornare, leo est eleifend velit, eu molestie sem nunc lobortis arcu. Phasellus aliquet risus eu porttitor aliquam. Nunc laoreet diam vitae nunc eleifend sagittis." +
      "Nam mollis tortor dui, fringilla facilisis orci convallis nec. Duis scelerisque molestie odio, ut gravida tellus suscipit sed. Suspendisse imperdiet dictum orci eu fringilla. Etiam consectetur, risus vel rutrum pulvinar, felis tellus sodales velit, id faucibus nibh urna a felis. Ut vitae sapien eu augue faucibus egestas. Proin luctus ac ligula eu rutrum. Donec placerat, urna eu sollicitudin congue, sapien erat ultrices arcu, nec venenatis ligula massa gravida tellus." +
      "Nunc condimentum, erat at vestibulum molestie, ante nisl consectetur lorem, viverra molestie mauris ligula eget eros. In ac urna finibus felis tempus mattis in in mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed blandit vestibulum posuere. Suspendisse enim ligula, ultrices eget condimentum in, venenatis eu turpis. Proin sapien quam, ullamcorper quis tellus quis, euismod bibendum massa. Nunc vitae efficitur nisi." +
      "Fusce commodo porttitor sapien, at eleifend justo eleifend rutrum. Nunc luctus sapien risus, id porta mauris mattis non. In auctor, diam a ultricies mattis, nisl neque volutpat elit, nec aliquam justo felis quis eros. Phasellus tristique vehicula enim, vitae tristique nulla porta ac. Integer ultrices aliquam arcu quis mollis. Nunc ac metus vitae metus bibendum pulvinar. Pellentesque maximus dignissim tellus, sed iaculis elit feugiat eu. Curabitur mi magna, scelerisque et enim eu, scelerisque scelerisque est. Nam viverra nisl arcu, ac accumsan sem blandit ut.",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 3,
    title: "TITLE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum est at elit accumsan blandit. Proin semper mi sit amet orci fermentum auctor. Morbi malesuada, justo at feugiat molestie, est elit elementum neque, non auctor ligula dui efficitur libero. Nullam tristique venenatis odio vel dapibus. Fusce tincidunt in ipsum at efficitur. Curabitur rutrum elit id ultricies congue. Quisque convallis mi eu dui pharetra, quis blandit ex sodales. Pellentesque malesuada enim sit amet ultricies aliquet. Quisque volutpat vehicula tincidunt. Phasellus scelerisque, velit et tincidunt ornare, leo est eleifend velit, eu molestie sem nunc lobortis arcu. Phasellus aliquet risus eu porttitor aliquam. Nunc laoreet diam vitae nunc eleifend sagittis." +
      "Nam mollis tortor dui, fringilla facilisis orci convallis nec. Duis scelerisque molestie odio, ut gravida tellus suscipit sed. Suspendisse imperdiet dictum orci eu fringilla. Etiam consectetur, risus vel rutrum pulvinar, felis tellus sodales velit, id faucibus nibh urna a felis. Ut vitae sapien eu augue faucibus egestas. Proin luctus ac ligula eu rutrum. Donec placerat, urna eu sollicitudin congue, sapien erat ultrices arcu, nec venenatis ligula massa gravida tellus." +
      "Nunc condimentum, erat at vestibulum molestie, ante nisl consectetur lorem, viverra molestie mauris ligula eget eros. In ac urna finibus felis tempus mattis in in mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed blandit vestibulum posuere. Suspendisse enim ligula, ultrices eget condimentum in, venenatis eu turpis. Proin sapien quam, ullamcorper quis tellus quis, euismod bibendum massa. Nunc vitae efficitur nisi." +
      "Fusce commodo porttitor sapien, at eleifend justo eleifend rutrum. Nunc luctus sapien risus, id porta mauris mattis non. In auctor, diam a ultricies mattis, nisl neque volutpat elit, nec aliquam justo felis quis eros. Phasellus tristique vehicula enim, vitae tristique nulla porta ac. Integer ultrices aliquam arcu quis mollis. Nunc ac metus vitae metus bibendum pulvinar. Pellentesque maximus dignissim tellus, sed iaculis elit feugiat eu. Curabitur mi magna, scelerisque et enim eu, scelerisque scelerisque est. Nam viverra nisl arcu, ac accumsan sem blandit ut.",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 4,
    title: "TITLE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum est at elit accumsan blandit. Proin semper mi sit amet orci fermentum auctor. Morbi malesuada, justo at feugiat molestie, est elit elementum neque, non auctor ligula dui efficitur libero. Nullam tristique venenatis odio vel dapibus. Fusce tincidunt in ipsum at efficitur. Curabitur rutrum elit id ultricies congue. Quisque convallis mi eu dui pharetra, quis blandit ex sodales. Pellentesque malesuada enim sit amet ultricies aliquet. Quisque volutpat vehicula tincidunt. Phasellus scelerisque, velit et tincidunt ornare, leo est eleifend velit, eu molestie sem nunc lobortis arcu. Phasellus aliquet risus eu porttitor aliquam. Nunc laoreet diam vitae nunc eleifend sagittis." +
      "Nam mollis tortor dui, fringilla facilisis orci convallis nec. Duis scelerisque molestie odio, ut gravida tellus suscipit sed. Suspendisse imperdiet dictum orci eu fringilla. Etiam consectetur, risus vel rutrum pulvinar, felis tellus sodales velit, id faucibus nibh urna a felis. Ut vitae sapien eu augue faucibus egestas. Proin luctus ac ligula eu rutrum. Donec placerat, urna eu sollicitudin congue, sapien erat ultrices arcu, nec venenatis ligula massa gravida tellus." +
      "Nunc condimentum, erat at vestibulum molestie, ante nisl consectetur lorem, viverra molestie mauris ligula eget eros. In ac urna finibus felis tempus mattis in in mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed blandit vestibulum posuere. Suspendisse enim ligula, ultrices eget condimentum in, venenatis eu turpis. Proin sapien quam, ullamcorper quis tellus quis, euismod bibendum massa. Nunc vitae efficitur nisi." +
      "Fusce commodo porttitor sapien, at eleifend justo eleifend rutrum. Nunc luctus sapien risus, id porta mauris mattis non. In auctor, diam a ultricies mattis, nisl neque volutpat elit, nec aliquam justo felis quis eros. Phasellus tristique vehicula enim, vitae tristique nulla porta ac. Integer ultrices aliquam arcu quis mollis. Nunc ac metus vitae metus bibendum pulvinar. Pellentesque maximus dignissim tellus, sed iaculis elit feugiat eu. Curabitur mi magna, scelerisque et enim eu, scelerisque scelerisque est. Nam viverra nisl arcu, ac accumsan sem blandit ut.",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 5,
    title: "TITLE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum est at elit accumsan blandit. Proin semper mi sit amet orci fermentum auctor. Morbi malesuada, justo at feugiat molestie, est elit elementum neque, non auctor ligula dui efficitur libero. Nullam tristique venenatis odio vel dapibus. Fusce tincidunt in ipsum at efficitur. Curabitur rutrum elit id ultricies congue. Quisque convallis mi eu dui pharetra, quis blandit ex sodales. Pellentesque malesuada enim sit amet ultricies aliquet. Quisque volutpat vehicula tincidunt. Phasellus scelerisque, velit et tincidunt ornare, leo est eleifend velit, eu molestie sem nunc lobortis arcu. Phasellus aliquet risus eu porttitor aliquam. Nunc laoreet diam vitae nunc eleifend sagittis." +
      "Nam mollis tortor dui, fringilla facilisis orci convallis nec. Duis scelerisque molestie odio, ut gravida tellus suscipit sed. Suspendisse imperdiet dictum orci eu fringilla. Etiam consectetur, risus vel rutrum pulvinar, felis tellus sodales velit, id faucibus nibh urna a felis. Ut vitae sapien eu augue faucibus egestas. Proin luctus ac ligula eu rutrum. Donec placerat, urna eu sollicitudin congue, sapien erat ultrices arcu, nec venenatis ligula massa gravida tellus." +
      "Nunc condimentum, erat at vestibulum molestie, ante nisl consectetur lorem, viverra molestie mauris ligula eget eros. In ac urna finibus felis tempus mattis in in mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed blandit vestibulum posuere. Suspendisse enim ligula, ultrices eget condimentum in, venenatis eu turpis. Proin sapien quam, ullamcorper quis tellus quis, euismod bibendum massa. Nunc vitae efficitur nisi." +
      "Fusce commodo porttitor sapien, at eleifend justo eleifend rutrum. Nunc luctus sapien risus, id porta mauris mattis non. In auctor, diam a ultricies mattis, nisl neque volutpat elit, nec aliquam justo felis quis eros. Phasellus tristique vehicula enim, vitae tristique nulla porta ac. Integer ultrices aliquam arcu quis mollis. Nunc ac metus vitae metus bibendum pulvinar. Pellentesque maximus dignissim tellus, sed iaculis elit feugiat eu. Curabitur mi magna, scelerisque et enim eu, scelerisque scelerisque est. Nam viverra nisl arcu, ac accumsan sem blandit ut.",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
  {
    id: 6,
    title: "TITLE",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum est at elit accumsan blandit. Proin semper mi sit amet orci fermentum auctor. Morbi malesuada, justo at feugiat molestie, est elit elementum neque, non auctor ligula dui efficitur libero. Nullam tristique venenatis odio vel dapibus. Fusce tincidunt in ipsum at efficitur. Curabitur rutrum elit id ultricies congue. Quisque convallis mi eu dui pharetra, quis blandit ex sodales. Pellentesque malesuada enim sit amet ultricies aliquet. Quisque volutpat vehicula tincidunt. Phasellus scelerisque, velit et tincidunt ornare, leo est eleifend velit, eu molestie sem nunc lobortis arcu. Phasellus aliquet risus eu porttitor aliquam. Nunc laoreet diam vitae nunc eleifend sagittis." +
      "Nam mollis tortor dui, fringilla facilisis orci convallis nec. Duis scelerisque molestie odio, ut gravida tellus suscipit sed. Suspendisse imperdiet dictum orci eu fringilla. Etiam consectetur, risus vel rutrum pulvinar, felis tellus sodales velit, id faucibus nibh urna a felis. Ut vitae sapien eu augue faucibus egestas. Proin luctus ac ligula eu rutrum. Donec placerat, urna eu sollicitudin congue, sapien erat ultrices arcu, nec venenatis ligula massa gravida tellus." +
      "Nunc condimentum, erat at vestibulum molestie, ante nisl consectetur lorem, viverra molestie mauris ligula eget eros. In ac urna finibus felis tempus mattis in in mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed blandit vestibulum posuere. Suspendisse enim ligula, ultrices eget condimentum in, venenatis eu turpis. Proin sapien quam, ullamcorper quis tellus quis, euismod bibendum massa. Nunc vitae efficitur nisi." +
      "Fusce commodo porttitor sapien, at eleifend justo eleifend rutrum. Nunc luctus sapien risus, id porta mauris mattis non. In auctor, diam a ultricies mattis, nisl neque volutpat elit, nec aliquam justo felis quis eros. Phasellus tristique vehicula enim, vitae tristique nulla porta ac. Integer ultrices aliquam arcu quis mollis. Nunc ac metus vitae metus bibendum pulvinar. Pellentesque maximus dignissim tellus, sed iaculis elit feugiat eu. Curabitur mi magna, scelerisque et enim eu, scelerisque scelerisque est. Nam viverra nisl arcu, ac accumsan sem blandit ut.",
    tonAmount: 0,
    amountToHelp: 20,
    imageUrl: "IMAGE",
    likes: 25,
    currency: "USDT",
  },
];

localStorage.setItem("items", JSON.stringify(initialData));

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
