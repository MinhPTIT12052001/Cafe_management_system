import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<<< HEAD:PhanThanhMinh-2/cafe-springboot/Cafe_management_system/cafe_fontend/src/app/material-component/dialog/product/product.component.spec.ts
      declarations: [ ProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
========
      imports: [AdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminComponent);
>>>>>>>> 711f66f92ea7358148a8fc62c2dcb16dc60b2e5d:PhamTranDuc-2/ShopComputerAngular/src/app/admin/admin.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
