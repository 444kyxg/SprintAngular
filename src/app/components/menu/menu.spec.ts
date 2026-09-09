import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu';
import { Router } from '@angular/router';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Cria um spy para simular as navegações do Router sem mudar de página nos testes
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: Router, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('deve criar o componente de menu', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar com o menu fechado (menuAberto = false)', () => {
    expect(component.menuAberto).toBeFalse();
  });

  it('deve alternar o estado do menu ao chamar toggleMenu()', () => {
    component.toggleMenu();
    expect(component.menuAberto).toBeTrue();

    component.toggleMenu();
    expect(component.menuAberto).toBeFalse();
  });

  it('deve navegar para a rota informada e fechar o menu ao chamar irPara()', () => {
    component.menuAberto = true;
    
    component.irPara('dashboard');

    expect(component.menuAberto).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('deve limpar o localStorage, fechar o menu e navegar para login ao chamar logout()', () => {
    spyOn(localStorage, 'removeItem');
    component.menuAberto = true;

    component.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(component.menuAberto).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});