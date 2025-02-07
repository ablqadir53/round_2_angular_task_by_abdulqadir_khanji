import { Injectable, signal, effect } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<Product[]>([]);

  constructor() {
    // Automatically save to localStorage whenever cart changes
    effect(() => {
      this.saveToLocalStorage(this.cartItems());
    });
  }

  addToCart(product: Product) {
    this.cartItems.update(items => [...items, product]);
  }

  private saveToLocalStorage(items: Product[]) {
    localStorage.setItem('cart', JSON.stringify({
      items,
      timestamp: new Date().getTime()
    }));
  }

  loadFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const { items, timestamp } = JSON.parse(savedCart);
      const twoDaysAgo = new Date().getTime() - (2 * 24 * 60 * 60 * 1000);
      
      if (timestamp > twoDaysAgo) {
        this.cartItems.set(items);
      } else {
        localStorage.removeItem('cart');
        this.cartItems.set([]);
      }
    }
  }
}