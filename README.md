# 🌱 Calculadora de Emissão CO2

Este projeto é uma ferramenta interativa para calcular a pegada de carbono baseada em diferentes meios de transporte e distâncias percorridas entre cidades.

## ✨ Funcionalidades
- Distância automática (40+ rotas BR)
- 4 meios de transporte
- Comparação de emissões
- Créditos de carbono
- Design responsivo

## 🚀 Como usar
1. Abra `index.html`
2. Digite origem/destino (ex: Belo Horizonte → Rio)
3. Distância auto-preenche (430km)
4. Escolha transporte
5. Clique "Calcular"

## 📁 Estrutura
```
index.html
css/style.css
js/
  ├── routes-data.js     # 78 rotas bidirecionais
  ├── config.js          # Configurações
  ├── calculator.js      # Cálculos
  ├── ui.js             # Interface
  └── app.js            # App principal
```

## 💡 Exemplos
**Belo Horizonte → Rio (430km):**
```
Carro: 51.6 kg CO2
Ônibus: 38.3 kg CO2 (-25%)
Bicicleta: 0 kg (100% eco)
```

## 🚀 Tecnologias Utilizadas
- HTML5 (Semântico)
- CSS3 (Metodologia BEM)
- JavaScript (Vanilla JS)

**Projeto desenvolvido como estudo no Bootcamp CI&T da DIO por Maike Simoncini.**  
[🔗 LinkedIn](https://www.linkedin.com/in/maike-simoncini-da-silva-9769b2287)
