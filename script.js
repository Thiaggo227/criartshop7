document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // VARIÁVEIS DE CONFIGURAÇÃO DO SUPABASE
    // ==========================================================
    const SUPABASE_URL = 'https://dfqqmnrpnpficpcfeunn.supabase.co/';
    const SUPABASE_ANON_KEY = 'sb_publishable_IZvKqoSAxKTIXtggpf_nYQ_zzZjk2cL';

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Armazenarão os dados carregados do banco para a busca global
    let tacasGlobais = [];
    let medalhasMetalGlobais = [];
    let trofeusMdfGlobais = [];

    // ==========================================================
    // 0A. CARREGAR MEDALHAS DE METAL DO SUPABASE DINAMICAMENTE
    // ==========================================================
    async function renderizarMedalhasMetalDoSupabase() {
        const carrosselMedalha = document.getElementById('carrosselMedalha');
        if (!carrosselMedalha) return;

        const { data: medalhas, error } = await supabaseClient
            .from('medalhas_metal')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Erro ao carregar medalhas de metal:', error);
            return;
        }

        if (!medalhas || medalhas.length === 0) return;

        medalhasMetalGlobais = medalhas;

        // Verifica qual aba está ativa no momento (por padrão é 'metal')
        const botaoAtivo = document.querySelector('.btn-filtro-medalha.ativa');
        const categoriaAtiva = botaoAtivo ? botaoAtivo.getAttribute('data-categoria') : 'metal';
        const displayInicial = categoriaAtiva === 'metal' ? 'flex' : 'none';

        const htmlMedalhasMetal = medalhas.map(medalha => `
            <div class="medalha-item" data-categoria="metal" data-id="${medalha.id}" style="display: ${displayInicial};">
                <div class="fita-azul"></div>
                <div class="argola-medalha"></div>
                <img src="${medalha.imagem_url || ''}" alt="Medalha Ref ${medalha.referencia}" class="medalha-pendurada-img">
                <div class="cardMedalha">
                    <h4><strong>${medalha.referencia}</strong></h4>
                </div>
                <div class="infoMedalha">
                    <button class="btn-fechar-info" type="button"><i class="fa-solid fa-xmark"></i></button>
                    <img src="${medalha.imagem_url || ''}" alt="Medalha Ref ${medalha.referencia}">
                    <div class="info-detalhes-texto">
                        <h3>Ref: ${medalha.referencia}</h3>
                        ${medalha.observacao ? `<p style="white-space: pre-line;">${medalha.observacao}</p>` : ''}
                    </div>
                    <div class="btnOrc">
                        <a href="https://wa.me/5543988151444?text=${encodeURIComponent(`Olá! Gostaria de solicitar um orçamento para a Medalha de Metal Ref: ${medalha.referencia}`)}" target="_blank">
                            <i class="bi bi-whatsapp"></i> Solicitar Orçamento
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        carrosselMedalha.insertAdjacentHTML('afterbegin', htmlMedalhasMetal);
    }

    renderizarMedalhasMetalDoSupabase();

    // ==========================================================
    // 0B. CARREGAR TAÇAS DO SUPABASE DINAMICAMENTE
    // ==========================================================
    async function renderizarTacasDoSupabase() {
        const gridTacas = document.getElementById('gridTacas');
        if (!gridTacas) return;

        const { data: tacas, error } = await supabaseClient
            .from('taca')
            .select('*');

        if (error) {
            console.error('Erro ao carregar taças:', error);
            return;
        }

        if (!tacas || tacas.length === 0) {
            gridTacas.innerHTML = '<p>Nenhuma taça cadastrada no momento.</p>';
            return;
        }

        tacasGlobais = tacas;

        gridTacas.innerHTML = tacas.map(taca => `
            <div class="cardTaca" data-id="${taca.id}">
                <div class="taca-img-container">
                    <img src="${taca.imagem_url || ''}" alt="${taca.nome}" class="taca-img">
                </div>
                <div class="taca-info">
                    ${taca.referencia ? `<span class="taca-ref"><strong>Ref:</strong> ${taca.referencia}</span>` : ''}
                    ${taca.altura ? `<span class="taca-altura"><strong>Altura:</strong> ${taca.altura}</span>` : ''}
                    <div class="taca-preco">R$ <span>${Number(taca.preco).toFixed(2).replace('.', ',')}</span></div>
                </div>
            </div>
        `).join('');
    }

    renderizarTacasDoSupabase();

    // ==========================================================
    // 0C. CARREGAR TROFÉUS MDF DO SUPABASE DINAMICAMENTE
    // ==========================================================
    async function renderizarTrofeusMdfDoSupabase() {
        const gridTrofeusFiltro = document.getElementById('carrosselTrofeusFiltro');
        if (!gridTrofeusFiltro) return;

        const { data: trofeusMdf, error } = await supabaseClient
            .from('trofeus_mdf')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Erro ao carregar troféus de MDF:', error);
            return;
        }

        if (!trofeusMdf || trofeusMdf.length === 0) return;

        trofeusMdfGlobais = trofeusMdf;

        // Verifica qual aba de troféu está ativa para definir se exibe ou oculta inicialmente
        const botaoAtivo = document.querySelector('.btn-filtro-trofeu.ativa');
        const categoriaAtiva = botaoAtivo ? botaoAtivo.getAttribute('data-categoria-trofeu') : 'polimero';
        const displayInicial = categoriaAtiva === 'mdf' ? 'block' : 'none';

        const htmlTrofeusMdf = trofeusMdf.map(trofeu => `
            <div class="cardTrofeu" data-categoria-trofeu="mdf" data-id="${trofeu.id}" style="display: ${displayInicial};">
                <img src="${trofeu.imagem || ''}" alt="${trofeu.nome}">
                <h3>${trofeu.nome}</h3>
                <h4>${trofeu.descricao}</h4>
            </div>
        `).join('');

        // Insere os troféus de MDF na grid junto com os demais
        gridTrofeusFiltro.insertAdjacentHTML('beforeend', htmlTrofeusMdf);
    }

    renderizarTrofeusMdfDoSupabase();

    // ==========================================================
    // 1. INICIALIZADOR DE CARROSSÉIS DE BANNER
    // ==========================================================
    function initCarrossel(containerSelector, intervalTime) {
        const containers = document.querySelectorAll(containerSelector);

        containers.forEach(container => {
            const images = container.querySelectorAll('img');
            const dotsContainer = container.querySelector('.dots-container');
            if (!images.length) return;

            let currentIndex = 0;
            let autoPlayTimer = null;

            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                images.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (index === 0) dot.classList.add('active');

                    dot.addEventListener('click', () => {
                        goToSlide(index);
                        resetTimer();
                    });

                    dotsContainer.appendChild(dot);
                });
            }

            const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

            function goToSlide(index) {
                images[currentIndex].classList.remove('active');
                if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

                currentIndex = index;

                images[currentIndex].classList.add('active');
                if (dots[currentIndex]) dots[currentIndex].classList.add('active');
            }

            function nextSlide() {
                const nextIndex = (currentIndex + 1) % images.length;
                goToSlide(nextIndex);
            }

            function resetTimer() {
                if (autoPlayTimer) clearInterval(autoPlayTimer);
                if (images.length > 1) {
                    autoPlayTimer = setInterval(nextSlide, intervalTime);
                }
            }

            if (images.length > 1) {
                autoPlayTimer = setInterval(nextSlide, intervalTime);
            }
        });
    }

    initCarrossel('.carrosselIntro', 5000);
    initCarrossel('.carrosselIntroS, .carrosselSecundario', 4000);

    // ==========================================================
    // 2. MENU HAMBÚRGUER DESLIZANTE COM OVERLAY E SCROLL LOCK
    // ==========================================================
    const menuToggle = document.getElementById('menuToggle');
    const navElements = document.getElementById('navElements');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = document.querySelectorAll('.menu a');

    if (menuToggle && navElements) {
        const toggleMenu = () => {
            const isActive = navElements.classList.toggle('active');
            if (menuOverlay) menuOverlay.classList.toggle('active');
            
            document.body.style.overflow = isActive ? 'hidden' : '';

            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        };

        menuToggle.addEventListener('click', toggleMenu);

        if (menuOverlay) {
            menuOverlay.addEventListener('click', toggleMenu);
        }

        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuLinks.forEach(item => item.classList.remove('ativo'));
                this.classList.add('ativo');

                navElements.classList.remove('active');
                if (menuOverlay) menuOverlay.classList.remove('active');
                document.body.style.overflow = '';

                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fa-solid fa-bars';
                }
            });
        });
    }

    // ==========================================================
    // 3. CARROSSÉIS DE TROFÉUS COM DOTS SINCRONIZADOS
    // ==========================================================
    const carrosselTrofeus = document.querySelectorAll('.carrosselTrofeu');

    carrosselTrofeus.forEach(carrosselTrofeu => {
        const wrapper = carrosselTrofeu.closest('.carrosselTrofeu-wrapper');
        if (!wrapper) return;
        
        const section = wrapper.closest('section');
        const dotsContainer = section ? section.querySelector('.dots-trofeu-container') : null;
        const cards = carrosselTrofeu.querySelectorAll('.cardTrofeu');

        const getScrollAmount = () => {
            const cardTrofeu = carrosselTrofeu.querySelector('.cardTrofeu');
            if (!cardTrofeu) return 300;
            const style = window.getComputedStyle(carrosselTrofeu);
            const gap = parseInt(style.gap) || 15;
            return cardTrofeu.offsetWidth + gap;
        };

        let dots = [];
        if (dotsContainer && cards.length > 0) {
            dotsContainer.innerHTML = '';
            cards.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot-trofeu');
                if (index === 0) dot.classList.add('active');

                dot.addEventListener('click', () => {
                    carrosselTrofeu.scrollTo({
                        left: index * getScrollAmount(),
                        behavior: 'smooth'
                    });
                });

                dotsContainer.appendChild(dot);
                dots.push(dot);
            });
        }

        const updateActiveDot = () => {
            if (!dots.length) return;
            const activeIndex = Math.round(carrosselTrofeu.scrollLeft / getScrollAmount());

            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeIndex);
            });
        };

        carrosselTrofeu.addEventListener('scroll', updateActiveDot);
    });

    // ==========================================================
    // 4. SELETOR DE MATERIAIS DE MEDALHAS (METAL, ACRÍLICO, MDF, ZAMAC)
    // ==========================================================
    const botoesFiltro = document.querySelectorAll('.btn-filtro-medalha');
    const carrosselMedalhaUnico = document.getElementById('carrosselMedalha');

    if (botoesFiltro.length > 0 && carrosselMedalhaUnico) {
        botoesFiltro.forEach(botao => {
            botao.addEventListener('click', () => {
                botoesFiltro.forEach(b => b.classList.remove('ativa'));
                botao.classList.add('ativa');

                const categoriaSelecionada = botao.getAttribute('data-categoria');
                const itensMedalha = carrosselMedalhaUnico.querySelectorAll('.medalha-item');

                itensMedalha.forEach(item => {
                    const catItem = item.getAttribute('data-categoria');
                    if (catItem === categoriaSelecionada) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });

                carrosselMedalhaUnico.scrollTo({ left: 0, behavior: 'smooth' });
            });
        });
    }

    // ==========================================================
    // 5. EXPANSIBILIDADE DO CARD DE MEDALHA (MODAL COM BLUR - DELEGADO)
    // ==========================================================
    if (carrosselMedalhaUnico) {
        carrosselMedalhaUnico.addEventListener('click', (e) => {
            const btnFechar = e.target.closest('.btn-fechar-info');
            if (btnFechar) {
                e.stopPropagation();
                const itemModal = btnFechar.closest('.medalha-item');
                if (itemModal) {
                    itemModal.classList.remove('ativa-modal');
                    document.body.style.overflow = '';
                }
                return;
            }

            const item = e.target.closest('.medalha-item');
            if (item && item.querySelector('.infoMedalha') && !item.classList.contains('ativa-modal')) {
                item.classList.add('ativa-modal');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // ==========================================================
    // 6. SELETOR DE MATERIAIS DE TROFÉUS (POLÍMERO, ACRÍLICO, MDF)
    // ==========================================================
    const botoesFiltroTrofeu = document.querySelectorAll('.btn-filtro-trofeu');
    const carrosselTrofeusFiltro = document.getElementById('carrosselTrofeusFiltro');

    if (botoesFiltroTrofeu.length > 0 && carrosselTrofeusFiltro) {
        botoesFiltroTrofeu.forEach(botao => {
            botao.addEventListener('click', () => {
                botoesFiltroTrofeu.forEach(b => b.classList.remove('ativa'));
                botao.classList.add('ativa');

                const categoriaSelecionada = botao.getAttribute('data-categoria-trofeu');
                const cardsTrofeu = carrosselTrofeusFiltro.querySelectorAll('.cardTrofeu');

                cardsTrofeu.forEach(card => {
                    const catCard = card.getAttribute('data-categoria-trofeu');
                    if (catCard === categoriaSelecionada) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });

                carrosselTrofeusFiltro.scrollTo({ left: 0, behavior: 'smooth' });
            });
        });
    }

    // ==========================================================
    // 0D. CARREGAR TROFÉUS ACRÍLICO DO SUPABASE DINAMICAMENTE
    // ==========================================================
    async function renderizarTrofeusAcrilicoDoSupabase() {
        const gridTrofeusFiltro = document.getElementById('carrosselTrofeusFiltro');
        if (!gridTrofeusFiltro) return;

        const { data: trofeusAcrilico, error } = await supabaseClient
            .from('trofeus_acrilico')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Erro ao carregar troféus de acrílico:', error);
            return;
        }

        if (!trofeusAcrilico || trofeusAcrilico.length === 0) return;

        const botaoAtivo = document.querySelector('.btn-filtro-trofeu.ativa');
        const categoriaAtiva = botaoAtivo ? botaoAtivo.getAttribute('data-categoria-trofeu') : 'polimero';
        const displayInicial = categoriaAtiva === 'acrilico' ? 'block' : 'none';

        const htmlTrofeusAcrilico = trofeusAcrilico.map(trofeu => `
            <div class="cardTrofeu" data-categoria-trofeu="acrilico" data-id="${trofeu.id}" style="display: ${displayInicial};">
                <img src="${trofeu.imagem || ''}" alt="${trofeu.nome}">
                <h3>${trofeu.nome}</h3>
                <h4>${trofeu.descricao}</h4>
            </div>
        `).join('');

        gridTrofeusFiltro.insertAdjacentHTML('beforeend', htmlTrofeusAcrilico);
    }

    renderizarTrofeusAcrilicoDoSupabase();

    // ==========================================================
    // 7. BUSCA DINÂMICA ULTRA-EFICIENTE (GLOBAL DE TODOS OS PRODUTOS E SUPABASE)
    // ==========================================================
    const btnBuscaMobile = document.getElementById('btnBuscaMobile');
    const modalBuscaMobile = document.getElementById('modalBuscaMobile');
    const modalBuscaOverlay = document.getElementById('modalBuscaOverlay');
    const btnFecharModal = document.getElementById('btnFecharModal');
    const inputBuscaModal = document.getElementById('inputBuscaModal');
    const inputBuscaDesktop = document.querySelector('.inputBusca');
    const iconeBuscaDesktop = document.querySelector('.busca-container i');
    const btnClearSearch = document.getElementById('btnClearSearch');
    const modalBuscaResultados = document.getElementById('modalBuscaResultados');
    const searchResultsCounter = document.getElementById('searchResultsCounter');

    // Função que varre a página inteira e coleta 100% dos dados dos produtos
    const coletarProdutosDaPagina = () => {
        const produtos = [];

        const extrairDados = (seletor, categoriaPadrao) => {
            document.querySelectorAll(seletor).forEach(card => {
                const titulo = card.querySelector('h3')?.textContent || '';
                const preco = card.querySelector('h1')?.textContent || card.querySelector('.taca-preco')?.textContent || '';
                const detalhe1 = card.querySelector('h4')?.textContent || '';
                const detalhe2 = card.querySelector('.brinde-detalhes-extras')?.textContent || '';
                const img = card.querySelector('img')?.src || '';

                produtos.push({
                    titulo,
                    preco,
                    detalhe: `${detalhe1} ${detalhe2}`.trim(),
                    img,
                    categoria: categoriaPadrao
                });
            });
        };

        // Coleta Medalhas de Metal vindas do Supabase
        medalhasMetalGlobais.forEach(medalha => {
            produtos.push({
                referencia: medalha.referencia,
                titulo: `Ref: ${medalha.referencia}`,
                preco: '',
                detalhe: medalha.observacao || 'Medalha de Metal',
                img: medalha.imagem_url || '',
                categoria: 'Medalha de Metal'
            });
        });

        // Coleta demais Medalhas estáticas (Acrílico, MDF, Zamac)
        document.querySelectorAll('.medalha-item:not([data-categoria="metal"])').forEach(item => {
            const titulo = item.querySelector('.cardMedalha h4 strong')?.textContent || 'Medalha';
            const detalhe = item.querySelector('.cardMedalha h4')?.textContent || '';
            const preco = '';
            const img = item.querySelector('img')?.src || '';
            produtos.push({ titulo, preco, detalhe, img, categoria: 'Medalha' });
        });

        extrairDados('.cardTrofeu', 'Troféu');
        extrairDados('.cardPlaca', 'Placa de Homenagem');
        extrairDados('.cardBrinde', 'Brinde Personalizado');

        // Coleta Taças do Supabase
        tacasGlobais.forEach(taca => {
            produtos.push({
                titulo: taca.nome || 'Taça Personalizada',
                preco: taca.preco ? `R$ ${Number(taca.preco).toFixed(2).replace('.', ',')}` : '',
                detalhe: `Ref: ${taca.referencia || 'N/A'} • Altura: ${taca.altura || 'N/A'}`,
                img: taca.imagem_url || '',
                categoria: 'Taça'
            });
        });

        return produtos;
    };

    const abrirModalBusca = () => {
        if (!modalBuscaMobile) return;
        modalBuscaMobile.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => inputBuscaModal?.focus(), 100);
    };

    const fecharModalBusca = () => {
        if (!modalBuscaMobile) return;
        modalBuscaMobile.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (btnBuscaMobile) btnBuscaMobile.addEventListener('click', abrirModalBusca);
    if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModalBusca);
    if (modalBuscaOverlay) modalBuscaOverlay.addEventListener('click', fecharModalBusca);

    if (iconeBuscaDesktop) {
        iconeBuscaDesktop.addEventListener('click', () => {
            abrirModalBusca();
            if (inputBuscaDesktop && inputBuscaDesktop.value.trim() !== '') {
                if (inputBuscaModal) inputBuscaModal.value = inputBuscaDesktop.value;
                executarBusca(inputBuscaDesktop.value.toLowerCase().trim());
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modalBuscaMobile?.classList.contains('active')) {
                fecharModalBusca();
            }
            const medalhaModalAtiva = document.querySelector('.medalha-item.ativa-modal');
            if (medalhaModalAtiva) {
                medalhaModalAtiva.classList.remove('ativa-modal');
                document.body.style.overflow = '';
            }
        }
    });

    const executarBusca = (termo) => {
        if (!modalBuscaResultados) return;

        if (!termo) {
            if (searchResultsCounter) searchResultsCounter.innerHTML = '';
            modalBuscaResultados.innerHTML = `
                <div class="modal-busca-empty">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p>Digite algo para iniciar a busca de produtos.</p>
                </div>
            `;
            return;
        }

        const todosProdutos = coletarProdutosDaPagina();
        const palavrasBusca = termo.split(' ').filter(Boolean);

        const filtrados = todosProdutos.filter(item => {
            const textoCompletoparabuscar = `${item.titulo} ${item.detalhe} ${item.preco} ${item.categoria}`.toLowerCase();
            return palavrasBusca.every(palavra => textoCompletoparabuscar.includes(palavra));
        });

        if (searchResultsCounter) {
            searchResultsCounter.innerHTML = `${filtrados.length} produto(s) encontrado(s)`;
        }

        if (filtrados.length === 0) {
            modalBuscaResultados.innerHTML = `
                <div class="modal-busca-empty">
                    <i class="fa-solid fa-face-frown"></i>
                    <p>Nenhum produto encontrado para "<strong>${termo}</strong>".</p>
                </div>
            `;
            return;
        }

        modalBuscaResultados.innerHTML = filtrados.map(item => `
            <div class="modal-result-card" data-ref="${item.referencia || item.titulo}">
                <img src="${item.img}" alt="${item.titulo}">
                <div class="modal-result-info">
                    <span class="modal-result-category">${item.categoria}</span>
                    <h4>${item.titulo}</h4>
                    <p style="white-space: pre-line;">${item.detalhe}</p>
                </div>
                ${item.preco ? `<div class="modal-result-price">${item.preco}</div>` : ''}
            </div>
        `).join('');
    };

    if (modalBuscaResultados) {
        modalBuscaResultados.addEventListener('click', (e) => {
            const cardResult = e.target.closest('.modal-result-card');
            if (!cardResult) return;

            const refProduto = cardResult.getAttribute('data-ref');
            fecharModalBusca();

            const itensMedalha = document.querySelectorAll('.medalha-item');
            for (const item of itensMedalha) {
                const h4Text = item.querySelector('.cardMedalha h4')?.textContent || '';
                if (h4Text.includes(refProduto) || refProduto.includes(h4Text)) {
                    item.click();
                    break;
                }
            }
        });
    }

    if (inputBuscaModal) {
        inputBuscaModal.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase().trim();
            if (btnClearSearch) {
                btnClearSearch.classList.toggle('visible', termo.length > 0);
            }
            executarBusca(termo);
        });
    }

    if (inputBuscaDesktop) {
        inputBuscaDesktop.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase().trim();
            if (termo.length > 0) {
                abrirModalBusca();
                if (inputBuscaModal) {
                    inputBuscaModal.value = termo;
                    inputBuscaModal.focus();
                }
                executarBusca(termo);
            }
        });
    }

    if (btnClearSearch) {
        btnClearSearch.addEventListener('click', () => {
            if (inputBuscaModal) {
                inputBuscaModal.value = '';
                inputBuscaModal.focus();
                btnClearSearch.classList.remove('visible');
                executarBusca('');
            }
        });
    }
});
