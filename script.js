// Variáveis globais para armazenar os dados dos CSVs
let procedimentosData = [];
let cidData = [];
let maxProcedimentos = 6;
let currentProcedimentos = 1;

// Função para carregar dados CSV
async function loadCSVData() {
    try {
        // Carregar dados de procedimentos
        const procedimentosResponse = await fetch('https://github.com/victorcords/apac-sus/blob/78a11aae2389bd397fb30fc7d183284cbe21ca8f/data/procedimentos.csv');
        const procedimentosText = await procedimentosResponse.text();
        procedimentosData = Papa.parse(procedimentosText, { header: true }).data;
        
        // Carregar dados de CID
        const cidResponse = await fetch('https://github.com/victorcords/apac-sus/blob/78a11aae2389bd397fb30fc7d183284cbe21ca8f/data/cid.csv');
        const cidText = await cidResponse.text();
        cidData = Papa.parse(cidText, { header: true }).data;
        
        console.log('Dados carregados com sucesso!');
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Função para inicializar a página
function initPage() {
    // Definir data atual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataAtual').value = today;
    
    // Adicionar evento para adicionar procedimentos
    document.getElementById('add-procedure').addEventListener('click', addProcedure);
    
    // Adicionar eventos para autocomplete
    setupAutocomplete();
    
    // Adicionar evento para buscar CNS
    document.getElementById('buscar-cns').addEventListener('click', buscarCNS);
    
    // Adicionar evento para gerar PDF
    document.getElementById('gerar-pdf').addEventListener('click', gerarPDF);
    
    // Adicionar evento para limpar formulário
    document.getElementById('limpar-form').addEventListener('click', limparFormulario);
}

// Função para adicionar novo procedimento
function addProcedure() {
    if (currentProcedimentos >= maxProcedimentos) {
        alert(`Máximo de ${maxProcedimentos} procedimentos atingido.`);
        return;
    }
    
    currentProcedimentos++;
    const newId = currentProcedimentos;
    
    const newProcedure = document.createElement('div');
    newProcedure.className = 'procedure-section';
    newProcedure.id = `procedure-${newId}`;
    
    newProcedure.innerHTML = `
        <div class="row g-3">
            <div class="col-md-3 autocomplete">
                <label for="codigo_${newId}" class="form-label">Código do Procedimento</label>
                <input type="text" class="form-control procedure-code" id="codigo_${newId}" maxlength="10" data-proc-id="${newId}">
                <div class="autocomplete-items" id="autocomplete-codigo-${newId}"></div>
            </div>
            <div class="col-md-6 autocomplete">
                <label for="nomeProc_${newId}" class="form-label">Nome do Procedimento</label>
                <input type="text" class="form-control procedure-name" id="nomeProc_${newId}" data-proc-id="${newId}">
                <div class="autocomplete-items" id="autocomplete-nome-${newId}"></div>
            </div>
            <div class="col-md-2">
                <label for="qntd_${newId}" class="form-label">Quantidade</label>
                <input type="number" class="form-control procedure-qty" id="qntd_${newId}" min="1" value="1" data-proc-id="${newId}">
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-danger btn-sm mt-4 remove-procedure" data-proc-id="${newId}">×</button>
            </div>
        </div>
    `;
    
    document.getElementById('procedimentos-container').appendChild(newProcedure);
    
    // Configurar autocomplete imediatamente após adicionar
    setupProcedureAutocomplete(newId);
    
    // Adicionar evento para remover procedimento
    newProcedure.querySelector('.remove-procedure').addEventListener('click', function() {
        this.closest('.procedure-section').remove();
        currentProcedimentos--;
    });
    
    // Configurar autocomplete para os novos campos
    setupProcedureAutocomplete(newId);
}

console.log('Dados de procedimentos:', procedimentosData);

// Função para configurar autocomplete
function setupAutocomplete() {
    // Configurar autocomplete para procedimentos
    for (let i = 1; i <= currentProcedimentos; i++) {
        setupProcedureAutocomplete(i);
    }
    
    // Configurar autocomplete para CID
    setupCIDAutocomplete();
}

function setupProcedureAutocomplete(procId) {
    const codeInput = document.getElementById(`codigo_${procId}`) || document.getElementById('codigo');
    const nameInput = document.getElementById(`nomeProc_${procId}`) || document.getElementById('nomeProc');
    
    if (codeInput) {
        codeInput.addEventListener('input', function() {
            const input = this.value.toUpperCase();
            const container = document.getElementById(`autocomplete-codigo-${procId}`) || document.getElementById('autocomplete-codigo-1');
            showAutocomplete(input, container, 'codigo', 'nome');
        });
        
        codeInput.addEventListener('focus', function() {
            const input = this.value.toUpperCase();
            const container = document.getElementById(`autocomplete-codigo-${procId}`) || document.getElementById('autocomplete-codigo-1');
            showAutocomplete(input, container, 'codigo', 'nome');
        });
    }
    
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            const input = this.value.toUpperCase();
            const container = document.getElementById(`autocomplete-nome-${procId}`) || document.getElementById('autocomplete-nome-1');
            showAutocomplete(input, container, 'nome', 'codigo');
        });
        
        nameInput.addEventListener('focus', function() {
            const input = this.value.toUpperCase();
            const container = document.getElementById(`autocomplete-nome-${procId}`) || document.getElementById('autocomplete-nome-1');
            showAutocomplete(input, container, 'nome', 'codigo');
        });
    }   
}

function setupCIDAutocomplete() {
    const codeInput = document.getElementById('codigoCID');
    const descInput = document.getElementById('descricaoCID');
    
    codeInput.addEventListener('input', function() {
        const input = this.value.toUpperCase();
        const container = document.getElementById('autocomplete-cid-code');
        showCIDAutocomplete(input, container, 'codigo', 'descricao');
    });
    
    codeInput.addEventListener('focus', function() {
        const input = this.value.toUpperCase();
        const container = document.getElementById('autocomplete-cid-code');
        showCIDAutocomplete(input, container, 'codigo', 'descricao');
    });
    
    descInput.addEventListener('input', function() {
        const input = this.value.toUpperCase();
        const container = document.getElementById('autocomplete-cid-desc');
        showCIDAutocomplete(input, container, 'descricao', 'codigo');
    });
    
    descInput.addEventListener('focus', function() {
        const input = this.value.toUpperCase();
        const container = document.getElementById('autocomplete-cid-desc');
        showCIDAutocomplete(input, container, 'descricao', 'codigo');
    });
}

function showAutocomplete(input, container, searchField, resultField) {
    if (!input || !container) return;
    
    container.innerHTML = '';
    if (!input) {
        container.style.display = 'none';
        return;
    }
    
    const filtered = procedimentosData.filter(item => 
        item[searchField] && item[searchField].toUpperCase().includes(input)
    ).slice(0, 10);
    
    if (filtered.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    try {
        // código existente
    } catch (error) {
        console.error('Erro no autocomplete:', error);
    }

    filtered.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${item[searchField]}</strong> - ${item[resultField]}`;
        div.addEventListener('click', function() {
            // Obter o ID do procedimento do container
            const containerId = container.id.split('-').pop();
            
            // Encontrar os inputs correspondentes
            const codeInput = containerId === '1' ? 
                document.getElementById('codigo') : 
                document.getElementById(`codigo_${containerId}`);
                
            const nameInput = containerId === '1' ? 
                document.getElementById('nomeProc') : 
                document.getElementById(`nomeProc_${containerId}`);
            
            // Preencher ambos os campos
            if (codeInput) codeInput.value = item.codigo;
            if (nameInput) nameInput.value = item.nome;
            
            container.innerHTML = '';
            container.style.display = 'none';
        });
        container.appendChild(div);
    });
    
    container.style.display = 'block';
    
    filtered.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${item[searchField]}</strong> - ${item[resultField]}`;
        div.addEventListener('click', function() {
            const procId = container.id.split('-').pop();
            const codeInput = document.getElementById(`codigo_${procId}`) || document.getElementById('codigo');
            const nameInput = document.getElementById(`nomeProc_${procId}`) || document.getElementById('nomeProc');
            
            if (searchField === 'codigo') {
                codeInput.value = item.codigo;
                nameInput.value = item.nome;
            } else {
                codeInput.value = item.codigo;
                nameInput.value = item.nome;
            }
            
            container.innerHTML = '';
            container.style.display = 'none';
        });
        container.appendChild(div);
    });
    
    container.style.display = 'block';
}

function showCIDAutocomplete(input, container, searchField, resultField) {
    if (!input || !container) return;
    
    container.innerHTML = '';
    if (!input) {
        container.style.display = 'none';
        return;
    }
    
    const filtered = cidData.filter(item => 
        item[searchField] && item[searchField].toUpperCase().includes(input)
    ).slice(0, 10);
    
    if (filtered.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    filtered.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${item[searchField]}</strong> - ${item[resultField]}`;
        div.addEventListener('click', function() {
            const codeInput = document.getElementById('codigoCID');
            const descInput = document.getElementById('descricaoCID');
            
            if (searchField === 'codigo') {
                codeInput.value = item.codigo;
                descInput.value = item.descricao;
            } else {
                codeInput.value = item.codigo;
                descInput.value = item.descricao;
            }
            
            container.innerHTML = '';
            container.style.display = 'none';
        });
        container.appendChild(div);
    });
    
    container.style.display = 'block';
}

// Fechar autocomplete quando clicar em outro lugar
document.addEventListener('click', function(e) {
    const autocompleteItems = document.querySelectorAll('.autocomplete-items');
    autocompleteItems.forEach(item => {
        if (e.target !== item && !item.contains(e.target)) {
            item.style.display = 'none';
        }
    });
});

function buscarCNS() {
    // Obter o valor do campo CNS (pode ser vazio)
    const cns = document.getElementById('autorizacao').value || '';
    
    // Abrir site de consulta de CNS em nova aba
    const url = cns 
        ? `https://sistemas.saude.gov.br/cnes/solicitacao_cnes/cnes_solicitacao.php?CNS=${cns}`
        : 'https://cnes.datasus.gov.br/pages/profissionais/consulta.jsp';
    
    window.open(url, '_blank');
}

// Função para gerar PDF
async function gerarPDF() {
    // Validar campos obrigatórios
    if (!document.getElementById('nome').value) {
        alert('Por favor, preencha o nome do paciente.');
        return;
    }
    
    if (!document.querySelector('input[name="sexo"]:checked')) {
        alert('Por favor, selecione o sexo do paciente.');
        return;
    }
    
    try {
        // 1. Primeiro carregamos o PDF
        const modelUrl = 'https://github.com/victorcords/apac-sus/blob/78a11aae2389bd397fb30fc7d183284cbe21ca8f/data/modelo.pdf';
        const existingPdfBytes = await fetch(modelUrl).then(res => res.arrayBuffer());
        
        // 2. Inicializamos o documento PDF
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        
        // 3. Carregar a fonte Courier - abordagem mais segura
        let courierFont;
        try {
            courierFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Times-Bold);
        } catch (fontError) {
            console.warn('Erro ao carregar fonte Courier, usando padrão:', fontError);
            courierFont = undefined;
        }
        
        // 4. Obter o formulário
        const form = pdfDoc.getForm();
        
        // 5. Função segura para aplicar formatação
        const safeSetFieldAppearance = (field, font, size) => {
            try {
                if (field && typeof field.updateAppearances === 'function') {
                    // Abordagem mais segura para atualizar aparências
                    const options = {};
                    if (font) options.font = font;
                    if (size) options.size = size;
                    
                    field.updateAppearances(options);
                }
            } catch (updateError) {
                console.warn('Erro ao atualizar aparência do campo:', updateError);
            }
        };
        
        // 6. Função para formatar texto
        const setFormattedText = (fieldName, text) => {
            try {
                const field = form.getTextField(fieldName);
                if (field) {
                    field.setText(text);
                    safeSetFieldAppearance(field, courierFont, 10);
                }
            } catch (fieldError) {
                console.warn(`Erro ao definir campo ${fieldName}:`, fieldError);
            }
        };
        
        // 7. Função para formatar datas
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const [year, month, day] = dateString.split('-');
            return `${day.padStart(2, '0')} ${month.padStart(2, '0')} ${year}`;
        };  
        
        // Função para ocultar um checkbox
        const hideCheckbox = (checkbox) => {
            if (!checkbox) return;
            
            // Método alternativo para tornar o checkbox invisível
            try {
                // 1. Tornar o checkbox transparente
                checkbox.setOpacity(0);
                
                // 2. Remover borda se existir
                if (checkbox.setBorderWidth) {
                    checkbox.setBorderWidth(0);
                }
                
                // 3. Alternativa para versões mais recentes
                if (checkbox.acroField) {
                    const widget = checkbox.acroField.getWidgets()[0];
                    if (widget && widget.setRectangle) {
                        // Reduzir o tamanho para quase zero
                        widget.setRectangle([0, 0, 0.1, 0.1]);
                    }
                }
            } catch (error) {
                console.warn('Não foi possível ocultar o checkbox:', error);
            }
        };

        // 9. Agora preenchemos os campos do formulário

        // Dados do paciente
        setFormattedText('NOME', document.getElementById('nome').value);
        
        // Sexo (tratamento especial para radio button)
        const sexoSelecionado = document.querySelector('input[name="sexo"]:checked')?.value;
        const checkboxMasculino = form.getCheckBox('Mas');
        const checkboxFeminino = form.getCheckBox('Fem');
        
        if (checkboxMasculino && checkboxFeminino) {
            if (sexoSelecionado === 'Mas') {
                checkboxMasculino.check();
                hideCheckbox(checkboxFeminino); // Oculta o feminino não selecionado
            } else if (sexoSelecionado === 'Fem') {
                checkboxFeminino.check();
                hideCheckbox(checkboxMasculino); // Oculta o masculino não selecionado
            } else {
                // Se nenhum sexo selecionado, oculta ambos
                hideCheckbox(checkboxMasculino);
                hideCheckbox(checkboxFeminino);
            }
        }

        // Preencher campos básicos
        form.getTextField('NOME').setText(document.getElementById('nome').value);
        form.getTextField('PRONTUARIO').setText(document.getElementById('prontuario').value || '');
        form.getTextField('CNS').setText(document.getElementById('cns').value || '');
        
        // Formatando data de nascimento
        const dataNasc = document.getElementById('dataNascimento').value;
        if (dataNasc) {
            const [year, month, day] = dataNasc.split('-');
            form.getTextField('DATA DE NASCIMENTO').setText(`${day}    ${month}    ${year}`);
        }
        
        form.getTextField('NOME DA MAE').setText(document.getElementById('nomeMae').value || '');
        form.getTextField('DDD').setText(document.getElementById('ddd').value || '');
        form.getTextField('DDD_2').setText(document.getElementById('ddd2').value || '');
        form.getTextField('10 TELEFONE DE CONTATO').setText(document.getElementById('telefone').value || '');
        form.getTextField('12 TELEFONE DE CONTATO').setText(document.getElementById('telefone2').value || '');
        form.getTextField('ENDERECO').setText(document.getElementById('endereco').value || '');
        form.getTextField('MUNICIPIO').setText(document.getElementById('municipio').value || '');
        form.getTextField('ESTADO').setText(document.getElementById('estado').value || '');
        form.getTextField('CEP').setText(document.getElementById('cep').value || '');
        
        // Preencher procedimentos
        // Adicione esta função auxiliar para formatar a quantidade
        function formatarQuantidade(qtd) {
            if (!qtd || isNaN(qtd) || qtd < 1) return '01'; // Valor padrão se inválido
            qtd = Math.min(99, Math.max(1, parseInt(qtd))); // Garante entre 1 e 99
            return qtd.toString().padStart(2, '0'); // Formata com 2 dígitos
        }
        
        for (let i = 1; i <= maxProcedimentos; i++) {
            const codeInput = document.getElementById(`codigo_${i}`) || (i === 1 ? document.getElementById('codigo') : null);
            const nameInput = document.getElementById(`nomeProc_${i}`) || (i === 1 ? document.getElementById('nomeProc') : null);
            const qtyInput = document.getElementById(`qntd_${i}`) || (i === 1 ? document.getElementById('qntd') : null);
            
            if (codeInput && codeInput.value) {
                setFormattedText(`CODIGO_${i > 1 ? i : ''}`, codeInput.value);
                setFormattedText(`NOME DO PROC_${i > 1 ? i : ''}`, nameInput ? nameInput.value : '');
                
                // Formatar a quantidade com 2 dígitos
                const quantidadeFormatada = formatarQuantidade(qtyInput ? qtyInput.value : '1');
                setFormattedText(`QNTD_${i > 1 ? i : ''}`, quantidadeFormatada);
            }
        }
        
        // Preencher CID
        form.getTextField('codigo_CID').setText(document.getElementById('codigoCID').value || '');
        form.getTextField('descricao_CID').setText(document.getElementById('descricaoCID').value || '');
        
        // Preencher outras informações
        form.getTextField('ANAMNESE').setText(document.getElementById('anamnese').value || '');
        form.getTextField('CHEFE').setText(document.getElementById('chefe').value || '');
        
        // Formatando data atual
        const dataAtual = document.getElementById('dataAtual').value;
        if (dataAtual) {
            const [year, month, day] = dataAtual.split('-');
            form.getTextField('Texto17').setText(`${day}    ${month}    ${year}`);
        }
        
        // 3. Identificação do médico (checkboxes)
        const checkboxCNS = form.getCheckBox('Check Box5');
        const checkboxCPF = form.getCheckBox('Check Box6');
        
        if (checkboxCNS && checkboxCPF) {
            if (document.getElementById('cnsMedico').checked) {
                checkboxCNS.check();
                hideCheckbox(checkboxCPF);
            } else if (document.getElementById('cpfMedico').checked) {
                checkboxCPF.check();
                hideCheckbox(checkboxCNS);
            } else {
                // Se nenhum selecionado, oculta ambos
                hideCheckbox(checkboxCNS);
                hideCheckbox(checkboxCPF);
            }
        }
        
        form.getTextField('AUTORIZACAO').setText(document.getElementById('autorizacao').value || '');
        
        // 9. Aplicar formatação a todos os campos de forma segura
        form.getFields().forEach(field => {
            safeSetFieldAppearance(field, courierFont, 10);
        });
        
        // Salvar PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `Autorizacao_Procedimento_${document.getElementById('nome').value.replace(/\s+/g, '_')}.pdf`;
        link.click();
    } catch (error) {
        console.error('Erro detalhado:', error);
        alert(`Erro ao gerar PDF: ${error.message}`);
    }
}

// Adicione este código ao seu script.js

// Controle do tema
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Verificar preferência do usuário
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Carregar tema salvo ou usar preferência do sistema
const currentTheme = localStorage.getItem('theme') || (userPrefersDark ? 'dark' : 'light');

// Aplicar tema inicial
if (currentTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark');
    themeToggle.checked = true;
}

// Ouvinte para alternar tema
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
});

// Função para limpar formulário
function limparFormulario() {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
        document.querySelector('form').reset();
        
        // Remover procedimentos adicionais
        const procedures = document.querySelectorAll('.procedure-section');
        procedures.forEach((proc, index) => {
            if (index > 0) proc.remove();
        });
        
        currentProcedimentos = 1;
        
        // Resetar data atual
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dataAtual').value = today;
    }
}

// Inicializar a página quando carregada
window.addEventListener('DOMContentLoaded', async function() {
    await loadCSVData();
    initPage();
});
