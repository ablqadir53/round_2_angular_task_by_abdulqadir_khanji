import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="card">
      <div class="card-header">
        <h3>{{ product.title }}</h3>
      </div>
      <div class="card-body">
        <img [src]="product.image" [alt]="product.title" loading="lazy">
        <p>{{ product.description }}</p>
      </div>
      <div class="card-footer">
        <span class="price">{{ product.price | currency }}</span>
        <button (click)="onBuy()">Buy Now</button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 1rem;
      padding: 1rem;
      transition: transform 0.2s;
      max-width: 300px;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
    }

    .card-body img {
      width: 100%;
      height: 200px;
      object-fit: contain;
      margin: 1rem 0;
    }

    .card-body p {
      color: #666;
      font-size: 0.9rem;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2c3e50;
    }

    button {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }

    button:hover {
      background: #2980b9;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() buyProduct = new EventEmitter<Product>();

  onBuy() {
    this.buyProduct.emit(this.product);
  }
}