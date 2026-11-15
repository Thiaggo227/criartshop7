document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const addProductBtn = document.getElementById('btn-add-product');
    const form = document.querySelector('form');

    // Elementos do Modal Customizado
    const customModal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Mapeamento de materiais permitidos por produto
    const allowedMaterials = {
        medalha: ['acrilico', 'mdf', 'metal', 'zamac'],
        trofeu: ['acrilico', 'mdf'],
        taca: ['polimero'],
        placa: ['acrilico', 'acm']
    };

    function showModal(message) {
        modalMessage.textContent = message;
        customModal.classList.add('active');
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            customModal.classList.remove('active');
        });
    }

    if (customModal) {
        customModal.addEventListener('click', (e) => {
            if (e.target === customModal) {
                customModal.classList.remove('active');
            }
        });
    }

    // Função para adicionar dias úteis a uma data a partir de hoje
    function addBusinessDays(days) {
        let date = new Date();
        // Zera as horas para evitar problemas com fuso horário / horário de verão
        date.setHours(0, 0, 0, 0);
        
        let addedDays = 0;
        while (addedDays < days) {
            date.setDate(date.getDate() + 1);
            let dayOfWeek = date.getDay();
            // 0 = Domingo, 6 = Sábado. Consideramos apenas dias úteis (1 a 5)
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                addedDays++;
            }
        }
        return date;
    }

    // Função para atualizar as opções de material dinamicamente conforme o produto escolhido
    function updateMaterialOptions(productItem) {
        const productSelect = productItem.querySelector('select:nth-of-type(1)') || productItem.querySelectorAll('select')[0];
        const materialSelect = productItem.querySelectorAll('select')[1];

        if (!productSelect || !materialSelect) return;

        const selectedProduct = productSelect.value;
        const validMaterials = allowedMaterials[selectedProduct];

        Array.from(materialSelect.options).forEach(option => {
            if (!option.value) return;

            if (validMaterials) {
                if (validMaterials.includes(option.value)) {
                    option.disabled = false;
                } else {
                    option.disabled = true;
                    if (materialSelect.value === option.value) {
                        materialSelect.value = '';
                    }
                }
            } else {
                option.disabled = false;
            }
        });
    }

    function attachProductEvents(productItem) {
        const productSelect = productItem.querySelectorAll('select')[0];
        
        if (productSelect) {
            productSelect.addEventListener('change', () => {
                updateMaterialOptions(productItem);
            });
        }

        updateMaterialOptions(productItem);
    }

    function updateProductNumbers() {
        const productItems = productsContainer.querySelectorAll('.product-item');
        productItems.forEach((item, index) => {
            const numberSpan = item.querySelector('.product-number');
            const titleTextSpan = item.querySelector('.product-title-text');
            
            const newIndex = index + 1;
            numberSpan.textContent = newIndex;
            titleTextSpan.textContent = `Produto ${newIndex}`;
        });
    }

    function createProductItem() {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        productItem.innerHTML = `
            <div class="product-header-bar">
                <div class="product-title-area">
                    <span class="product-number">1</span>
                    <span class="product-title-text">Produto 1</span>
                </div>
                <button type="button" class="btn-delete" title="Remover produto">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>

            <div class="product-grid">
                <!-- Produto -->
                <div class="form-group">
                    <label>Produto *</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-box left-icon"></i>
                        <select required>
                            <option value="" disabled selected>Selecione o produto</option>
                            <option value="medalha">Medalha</option>
                            <option value="trofeu">Troféu</option>
                            <option value="taca">Taça</option>
                            <option value="placa">Placa</option>
                            <option value="pedra">Pedra</option>
                            <option value="brinde">Brinde</option>
                        </select>
                        <i class="fa-solid fa-chevron-down right-icon"></i>
                    </div>
                </div>

                <!-- Material -->
                <div class="form-group">
                    <label>Material *</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-layer-group left-icon"></i>
                        <select required>
                            <option value="" disabled selected>Selecione o material</option>
                            <option value="acrilico">Acrílico</option>
                            <option value="acm">ACM</option>
                            <option value="aco-inox">Aço Inox</option>
                            <option value="mdf">MDF</option>
                            <option value="metal">Metal</option>
                            <option value="polimero">Polímero</option>
                            <option value="zamac">Zamac</option>
                        </select>
                        <i class="fa-solid fa-chevron-down right-icon"></i>
                    </div>
                </div>

                <!-- Quantidade -->
                <div class="form-group">
                    <label>Quantidade *</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-hashtag left-icon"></i>
                        <input type="text" placeholder="Qtd." required>
                    </div>
                </div>

                <!-- Tamanho -->
                <div class="form-group">
                    <label>Tamanho</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-ruler-combined left-icon"></i>
                        <input type="text" placeholder="Tamanho" required>
                    </div>
                </div>

                <!-- Data -->
                <div class="form-group">
                    <label>Data *</label>
                    <div class="input-wrapper">
                        <i class="fa-regular fa-calendar left-icon"></i>
                        <input type="text" placeholder="dd/mm/aaaa" onfocus="(this.type='date')" onblur="(this.type='text')" required>
                        <i class="fa-regular fa-calendar right-icon"></i>
                    </div>
                </div>

                <!-- Anexar Imagem -->
                <div class="form-group">
                    <label>Imagem de Referência</label>
                    <div class="input-wrapper">
                        <i class="fa-solid fa-image left-icon"></i>
                        <input type="file" accept="image/*" class="file-input">
                    </div>
                </div>

                <!-- Observação -->
                <div class="form-group observation-group">
                    <label>Observação</label>
                    <div class="input-wrapper">
                        <i class="fa-regular fa-file-lines left-icon"></i>
                        <textarea placeholder="Informe detalhes, tamanho, personalizações, etc."></textarea>
                    </div>
                </div>
            </div>
        `;

        attachProductEvents(productItem);

        const deleteBtn = productItem.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => {
            if (productsContainer.querySelectorAll('.product-item').length > 1) {
                productItem.remove();
                updateProductNumbers();
            } else {
                showModal('O orçamento precisa ter pelo menos um produto.');
            }
        });

        return productItem;
    }

    const initialProductItem = document.querySelector('.product-item');
    if (initialProductItem) {
        attachProductEvents(initialProductItem);

        const initialDeleteBtn = initialProductItem.querySelector('.btn-delete');
        if (initialDeleteBtn) {
            initialDeleteBtn.addEventListener('click', () => {
                if (productsContainer.querySelectorAll('.product-item').length > 1) {
                    initialProductItem.remove();
                    updateProductNumbers();
                } else {
                    showModal('O orçamento precisa ter pelo menos um produto.');
                }
            });
        }
    }

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            const newItem = createProductItem();
            productsContainer.appendChild(newItem);
            updateProductNumbers();
        });
    }

    // Validação e Envio para o WhatsApp
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const productItems = productsContainer.querySelectorAll('.product-item');
            let isValid = true;
            let errorMessage = '';
            let whatsappMessage = "Olá! Gostaria de solicitar um orçamento.\n\n";
            let totalUnidades = 0;
            let temImagens = false;

            productItems.forEach((item, index) => {
                const selects = item.querySelectorAll('select');
                const productSelect = selects[0];
                const materialSelect = selects[1];
                const qtyInput = item.querySelector('input[placeholder="Qtd."]');
                const dateInput = item.querySelector('input[type="date"], input[onfocus]');
                const fileInput = item.querySelector('.file-input');
                const obsTextarea = item.querySelector('textarea');

                const produtoVal = productSelect ? productSelect.value : '';
                const produtoText = productSelect && productSelect.selectedIndex > 0 ? productSelect.options[productSelect.selectedIndex].text : '';
                
                const materialVal = materialSelect ? materialSelect.value : '';
                const materialText = materialSelect && materialSelect.selectedIndex > 0 ? materialSelect.options[materialSelect.selectedIndex].text : '';
                
                const quantidade = qtyInput ? parseInt(qtyInput.value, 10) || 0 : 0;
                let dataStr = dateInput ? dateInput.value : '';
                const observacao = obsTextarea ? obsTextarea.value.trim() : '';
                const temArquivo = fileInput && fileInput.files.length > 0;
                const numProduto = index + 1;

                if (temArquivo) {
                    temImagens = true;
                }

                // 1. Regras de quantidade mínima
                if (produtoVal === 'medalha') {
                    if (materialVal === 'acrilico' && quantidade < 20) {
                        isValid = false;
                        errorMessage = `Produto ${numProduto}: Para Medalha em Acrílico, a quantidade deve ser 20 ou acima.`;
                    } else if (materialVal === 'zamac' && quantidade < 70) {
                        isValid = false;
                        errorMessage = `Produto ${numProduto}: Para Medalha em Zamac, a quantidade deve ser 70 ou acima.`;
                    }
                }

                // 2. Validação de Dias Úteis para a Entrega
                if (dataStr) {
                    const selectedDate = new Date(dataStr + 'T00:00:00');
                    selectedDate.setHours(0, 0, 0, 0);

                    // Define o prazo mínimo de dias úteis com base no material (Zamac = 20 dias, Outros = 7 dias)
                    const requiredBusinessDays = (materialVal === 'zamac') ? 20 : 7;
                    const minAllowedDate = addBusinessDays(requiredBusinessDays);

                    if (selectedDate < minAllowedDate) {
                        isValid = false;
                        const formattedMinDate = `${String(minAllowedDate.getDate()).padStart(2, '0')}/${String(minAllowedDate.getMonth() + 1).padStart(2, '0')}/${minAllowedDate.getFullYear()}`;
                        const tipoMaterialNome = (materialVal === 'zamac') ? 'Zamac (20 dias úteis)' : 'demais materiais (7 dias úteis)';
                        errorMessage = `Produto ${numProduto}: A data escolhida não respeita o prazo mínimo de 20 dias úteis. A data mais próxima é a partir de ${formattedMinDate} após a aprovação do layout`;
                    }
                }

                totalUnidades += quantidade;

                if (dataStr && dataStr.includes('-')) {
                    const parts = dataStr.split('-');
                    if (parts.length === 3) {
                        dataStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    }
                }

                const numStr = numProduto < 10 ? `0${numProduto}` : numProduto;

                whatsappMessage += `📦 PRODUTO ${numStr}\n`;
                whatsappMessage += `Produto: ${produtoText}\n`;
                whatsappMessage += `Quantidade: ${quantidade} unidades\n`;
                whatsappMessage += `Material: ${materialText}\n`;
                whatsappMessage += `Data necessária: ${dataStr || 'Não informada'}\n`;
                whatsappMessage += `Imagem de referência: ${temArquivo ? 'Anexada (enviarei a seguir)' : 'Não informada'}\n`;
                whatsappMessage += `Observação: ${observacao || 'Nenhuma observação informada.'}\n\n`;
            });

            if (!isValid) {
                showModal(errorMessage);
                return;
            }

            whatsappMessage += `📋 RESUMO DA SOLICITAÇÃO\n`;
            whatsappMessage += `Total de produtos: ${productItems.length} tipos\n`;
            whatsappMessage += `Total de unidades: ${totalUnidades}\n`;
            if (temImagens) {
                whatsappMessage += `*Observação: Estou enviando as imagens dos produtos logo abaixo.*\n`;
            }
            whatsappMessage += `Aguardo o retorno. Obrigado!`;

            const telefone = "5543984856043";
            const url = `https://wa.me/${telefone}?text=${encodeURIComponent(whatsappMessage)}`;
            
            window.open(url, '_blank');
        });
    }
});