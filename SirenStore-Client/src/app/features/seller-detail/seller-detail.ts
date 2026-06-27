import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SellerService, SellerPublicProfile } from '../../core/services/seller.service';

@Component({
  selector: 'app-seller-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seller-detail.html',
})
export class SellerDetailComponent implements OnInit {
  seller: SellerPublicProfile | null = null;
  isLoading = true;
  errorMessage = '';

  private route = inject(ActivatedRoute);
  private sellerService = inject(SellerService);

  ngOnInit(): void {
    const sellerId = this.route.snapshot.paramMap.get('id');
    if (sellerId) {
      this.loadSeller(Number(sellerId));
    } else {
      this.errorMessage = 'Satıcı bulunamadı.';
      this.isLoading = false;
    }
  }

  loadSeller(id: number): void {
    this.sellerService.getSellerProfile(id).subscribe({
      next: (data: SellerPublicProfile) => {
        this.seller = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Satıcı bilgileri yüklenemedi', err);
        this.errorMessage = 'Satıcı bilgileri yüklenirken bir hata oluştu.';
        this.isLoading = false;
      }
    });
  }
}
