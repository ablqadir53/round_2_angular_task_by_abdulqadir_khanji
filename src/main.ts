import { Component, inject, signal, effect } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ProductCardComponent } from './app/components/product-card/product-card.component';
import { CartComponent } from './app/components/cart/cart.component';
import { ProductService } from './app/services/product.service';
import { CartService } from './app/services/cart.service';
import { Product } from './app/models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ProductCardComponent,
    CartComponent
  ],
  template: `
    <div class="container">
      <header>
        <h1>Product Store</h1>
        <button (click)="toggleCart()">
          Cart ({{ cartItemCount() }})
        </button>
      </header>

      @if (showCart()) {
        <app-cart />
      } @else {
        <div class="products-grid">
          @for (product of displayedProducts(); track product.id) {
            <app-product-card
              [product]="product"
              (buyProduct)="addToCart($event)"
            />
          }
        </div>
      }

      @if (loading()) {
        <div class="loading">Loading more products...</div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
      padding: 1rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }
  `]
})
export class App {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  products = signal<Product[]>([]);
  displayedProducts = signal<Product[]>([]);
  loading = signal(false);
  showCart = signal(false);
  cartItemCount = signal(0);
  currentPage = signal(1);
  itemsPerPage = 8;

  constructor() {
    this.loadProducts();
    this.cartService.loadFromLocalStorage();
    this.setupInfiniteScroll();
    
    effect(() => {
      this.cartItemCount.set(this.cartService.cartItems().length);
    });
  }

  private loadProducts() {
    if (this.loading()) return;
    
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.updateDisplayedProducts();
        this.loading.set(false);
      },
      error: () => {
        console.error('Failed to load products');
        this.loading.set(false);
      }
    });
  }

  private updateDisplayedProducts() {
    const start = 0;
    const end = this.currentPage() * this.itemsPerPage;
    this.displayedProducts.set(this.products().slice(start, end));
  }

  private setupInfiniteScroll() {
    window.addEventListener('scroll', () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !this.loading() &&
        !this.showCart() &&
        this.displayedProducts().length < this.products().length
      ) {
        this.currentPage.update(page => page + 1);
        this.updateDisplayedProducts();
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  toggleCart() {
    this.showCart.update(current => !current);
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
}).catch(err => console.error(err));