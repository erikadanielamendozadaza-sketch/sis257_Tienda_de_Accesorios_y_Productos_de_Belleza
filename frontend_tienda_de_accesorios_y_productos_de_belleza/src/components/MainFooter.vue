<script setup lang="ts">
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <!-- Logo -->
        <div class="col-lg-4 col-md-6 col-sm-6">
          <div class="footer__about">
            <div class="footer__logo">
              <RouterLink to="/">
                <img src="@/assets/img/ze_da_logo.jpeg" alt="Ze & Da" class="footer-logo-img" />
              </RouterLink>
            </div>
            <p class="footer__desc">
              ✨ Tu tienda de belleza favorita. Los mejores productos de beauty y accesorios en un solo lugar.
            </p>
            <div class="footer__social">
              <a href="https://instagram.com/zeandabeauty" target="_blank"><i class="pi pi-instagram"></i></a>
              <a href="https://tiktok.com/@zeandabeauty" target="_blank"><i class="pi pi-video"></i></a>
              <a href="https://facebook.com/zeandabeauty" target="_blank"><i class="pi pi-facebook"></i></a>
            </div>
          </div>
        </div>
        
        <div class="col-lg-2 offset-lg-1 col-md-3 col-sm-6">
          <div class="footer__widget">
            <h6>Enlaces</h6>
            <ul>
              <li><RouterLink to="/productos">Productos</RouterLink></li>
              <li><RouterLink to="/clientes">Clientes</RouterLink></li>
              <li><RouterLink to="/proveedores">Proveedores</RouterLink></li>
              <li><RouterLink to="/ventas">Ventas</RouterLink></li>
              <li><RouterLink to="/about">Nosotros</RouterLink></li>
            </ul>
          </div>
        </div>

        <div class="col-lg-2 col-md-3 col-sm-6">
          <div class="footer__widget">
            <h6>Ayuda</h6>
            <ul>
              <li><a href="#">Contáctanos</a></li>
              <li><a href="#">Envíos</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Preguntas</a></li>
            </ul>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 col-sm-6">
          <div class="footer__widget">
            <h6>✨ NewLetter</h6>
            <div class="footer__newslatter">
              <p>¡Sé la primera en saber sobre novedades y ofertas!</p>
              <form action="#" class="newsletter-form">
                <input type="email" placeholder="Tu email" />
                <button type="submit">
                  <i class="pi pi-send"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-lg-12 text-center">
          <div class="footer__copyright__text">
            <p>
              💕 © 2024 <strong>Ze & Da Beauty</strong>. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>

.footer {
  background: #1f1f1f;
  padding: 60px 0 20px;
  color: white;
}
.footer__about {
  margin-bottom: 30px;
}

.footer-logo-img {
  width: 140px;
  height: auto;
  margin-bottom: 15px;
}

.footer__desc {
  font-size: 14px;
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 20px;
}

.footer__social {
  display: flex;
  gap: 12px;
}

.footer__social a {
  width: 40px;
  height: 40px;
  background: #ec4899;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.footer__social a:hover {
  background: #db2777;
  transform: translateY(-3px);
}

.footer__widget h6 {
  color: #ec4899;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.footer__widget ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__widget ul li {
  margin-bottom: 12px;
}

.footer__widget ul li a {
  color: #aaa;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer__widget ul li a:hover {
  color: #ec4899;
}

.footer__newslatter p {
  color: #aaa;
  font-size: 14px;
  margin-bottom: 15px;
}

.newsletter-form {
  display: flex;
  background: #333;
  border-radius: 25px;
  overflow: hidden;
}

.newsletter-form input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 15px;
  color: white;
  font-size: 14px;
}

.newsletter-form input::placeholder {
  color: #888;
}

.newsletter-form input:focus {
  outline: none;
}

.newsletter-form button {
  background: #ec4899;
  border: none;
  padding: 12px 18px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.newsletter-form button:hover {
  background: #db2777;
}

/* Copyright */
.footer__copyright__text {
  padding-top: 25px;
  margin-top: 30px;
  border-top: 1px solid #333;
}

.footer__copyright__text p {
  color: #666;
  font-size: 13px;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .footer {
    padding: 40px 0 20px;
  }
  
  .footer__about,
  .footer__widget {
    margin-bottom: 30px;
  }
}
</style>