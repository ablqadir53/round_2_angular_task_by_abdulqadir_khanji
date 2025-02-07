import { Component, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="cart-container">
      <h2>Shopping Cart</h2>
      <div class="cart-items">
        @for (item of cartItems(); track item.id) {
          <div class="cart-item">
            <img [src]="item.image" [alt]="item.title">
            <div class="item-details">
              <h3>{{ item.title }}</h3>
              <p>{{ item.price | currency }}</p>
            </div>
          </div>
        }
      </div>
      <div class="cart-total">
        <h3>Total: {{ total() | currency }}</h3>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .cart-item img {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }

    .item-details {
      flex: 1;
    }

    .cart-total {
      margin-top: 1rem;
      text-align: right;
    }
  `]
})
export class CartComponent {
  private cartService = inject(CartService);
  cartItems = this.cartService.cartItems;
  
  total = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.price, 0);
  });
}