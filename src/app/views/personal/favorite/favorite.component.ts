import {Component, Input, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {


  products: FavoriteType[] = [];
  serveStaticPath = environment.serverStaticPath;
  count: number = 1;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) {
  }

  ngOnInit(): void {
        this.favoriteService.getFavorites()
          .subscribe((data: FavoriteType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              const err = (data as DefaultResponseType).message;
              throw new Error(err);
            }
            this.products = data as FavoriteType[];

            this.cartService.getCart()
              .subscribe((productInCart: CartType | DefaultResponseType) => {
                if ((productInCart as DefaultResponseType).error !== undefined) {
                  throw new Error((productInCart as DefaultResponseType).message);
                }

                const cartData = productInCart as CartType;
                if (cartData) {
                  console.log(cartData)
                  const cartProducts = cartData.items;
                  this.products = this.products.map(item => {
                    const index = cartProducts.findIndex(product => {
                      return item.id === product.product.id;
                    })
                    if (index !== -1) {
                      return {
                        ...item,
                        countInCart: cartProducts[index].quantity
                      }
                    }
                    return item;
                  })
                }
              });


          });
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      })
  }

  addToCart(id: string) {
    this.cartService.updateCart(id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        const currentProductIndex = this.products.findIndex(product => product.id === id);
        if (currentProductIndex > -1) {
          this.products[currentProductIndex].countInCart = this.count;
        }
      })
  }

  removeFromCart(id: string) {
    this.cartService.updateCart(id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        const currentProductIndex = this.products.findIndex(product => product.id === id);
        this.products[currentProductIndex].countInCart = 0;
        this.count = 1;
      })
  }

  updateCount(value: number, id: string) {
    this.count = value;

    const currentProductIndex = this.products.findIndex(product => product.id === id);
    this.products[currentProductIndex].countInCart = this.count;


    if (this.products[currentProductIndex].countInCart) {
      this.cartService.updateCart(id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.products[currentProductIndex].countInCart = this.count;
        })
    }
  }


}
