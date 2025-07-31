const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const sStatus = document.querySelector('#m-status')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = (e) => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  const statusSelect = document.getElementById('m-status')

  if (edit) {
    sNome.value = itens[index].nome
    sFuncao.value = itens[index].funcao
    sSalario.value = itens[index].salario
    document.getElementById('m-status').value =
      itens[index].status || 'andamento'
    id = index
  } else {
    sNome.value = ''
    sFuncao.value = ''
    sSalario.value = ''
    document.getElementById('m-status').value = 'andamento' // valor padrão para novo
  }
}

function editItem(index) {
  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  // loadItens()
  itens = getItensBD()
  btnOrdenarData.click()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  const partes = item.data.split('/')
  const dataFormatada = `${partes[0]}/${partes[1]}/${partes[2].slice(-2)}`

  const nome = item.nome.trim().toLowerCase()
  let estiloLinha = ''

  switch (nome) {
    case 'walter':
      estiloLinha = 'background-color: #FFB6C1;'
      break
    case 'cleber':
      estiloLinha = 'background-color: #cce5ff;'
      break
    case 'getulio':
      estiloLinha = 'background-color: #ffe5b4;'
      break
    case 'braga':
      estiloLinha = 'background-color: #ADFF2F;'
      break
    case 'emerson':
      estiloLinha = 'background-color: #90EE90;'
      break
    case 'miro':
      estiloLinha = 'background-color: #F4A460;' // preto com texto branco
      // estiloLinha = 'background-color: #000000; color: white;' // preto com texto branco
      break
    case 'pepeu':
      estiloLinha = 'background-color: #DEB887;'
      break
    case 'josian':
      estiloLinha = 'background-color: #fff3cd;'
      break
  }

  tr.setAttribute('style', estiloLinha)

  // Estilos por função para texto
  const funcao = item.funcao.trim().toLowerCase()
  let funcaoStyle = ''

  if (funcao === 'eletricista') {
    funcaoStyle = 'style="color: blue; font-weight: bold;"'
  } else if (funcao === 'mecânico') {
    funcaoStyle = 'style="color: red; font-weight: bold;"'
  } else if (funcao === 'utilidades') {
    funcaoStyle = 'style="color: green; font-weight: bold;"'
  }

  const statusLabels = {
    andamento: { color: '#007bff', emoji: '🟦', label: 'Andamento' },
    pausado: { color: '#fd7e14', emoji: '⏸️', label: 'Pausado' },
    concluido: { color: '#28a745', emoji: '✅', label: 'Concluído' },
    cancelado: { color: '#dc3545', emoji: '❌', label: 'Cancelado' },
  }

  const statusInfo = statusLabels[item.status] || {
    color: '#000',
    emoji: '',
    label: item.status,
  }

  // Cria a linha de status (tr1)
  const tr1 = document.createElement('tr')
  tr1.setAttribute('style', estiloLinha)
  tr1.innerHTML = `
  <td class="nomes" colspan="7" style="font-weight: bold; font-size: 10px; color: ${statusInfo.color}; text-align: center;">
    ${item.nome} - <i ${funcaoStyle}>${item.funcao}</i>
  </td>
`

  // Cria a linha de dados normais (tr2)
  const tr2 = document.createElement('tr')
  tr2.setAttribute('style', estiloLinha)
  tr2.innerHTML = `
  <td class="dataHora" style="width: 45px; text-align: center;">
  ${dataFormatada}<br>${item.hora}
</td>

  <td>Setor: Produção.<br>Equipamento:<br>${item.salario}</td>
  <td>
    <span style="font-weight: bold; font-size: 8px; color: ${statusInfo.color};">
      ${statusInfo.emoji}<br>${statusInfo.label}
    </span>
  </td>
  <td class="acaoDuplo" style="width: 1px; text-align: center;">
    <button onclick="editItemById(${item.id})">
      <i class='bx bx-edit'></i>
    </button>
  </td>
  <td class="acaoDuplo" style="width: 1px; text-align: center;">
    <button onclick="deleteItemById(${item.id})">
      <i class='bx bx-trash'></i>
    </button>
  </td>
`

  // Cria a linha em branco (tr3)
  const tr3 = document.createElement('tr')
  tr3.innerHTML = `
    <td colspan="7" style="height: 0px; padding: 1px; border: none;"></td>
  `

  // Adiciona ambas as linhas à tabela
  tbody.appendChild(tr1)
  tbody.appendChild(tr2)
  tbody.appendChild(tr3)
}

function editItemById(itemId) {
  const index = itens.findIndex((item) => item.id === itemId)
  if (index !== -1) {
    openModal(true, index)
  }
}

function deleteItemById(itemId) {
  const index = itens.findIndex((item) => item.id === itemId)
  if (index !== -1) {
    itens.splice(index, 1)
    setItensBD()
    itens = getItensBD()
    btnOrdenarData.click()
  }
}

btnSalvar.onclick = (e) => {
  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
    return
  }

  e.preventDefault()

  const agora = new Date()
  const dataBrasil = agora.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  })
  const horaBrasil = agora.toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  })

  if (id !== undefined) {
    const atual = itens[id]
    itens[id] = {
      ...atual,
      nome: sNome.value,
      funcao: sFuncao.value,
      salario: sSalario.value,
      // status: sStatus.value,
      data: dataBrasil,
      hora: horaBrasil,
      status:
        document.getElementById('m-status').value.toLowerCase() || atual.status,
    }
  } else {
    itens.push({
      id: Date.now(),
      nome: sNome.value,
      funcao: sFuncao.value,
      salario: sSalario.value,
      data: dataBrasil,
      hora: horaBrasil,
      status: 'andamento', // ✅ adicionando status ao novo item
    })
  }

  setItensBD()

  modal.classList.remove('active')
  // loadItens()
  itens = getItensBD()
  btnOrdenarData.click()
  id = undefined
}

function loadItens(lista = null) {
  itens = getItensBD()
  tbody.innerHTML = ''
  const dadosParaExibir = lista || itens
  dadosParaExibir.forEach((item, index) => {
    insertItem(item, index)
  })
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

const nomeParaFuncao = {
  Ubiratan: 'Supervisor',
  Walter: 'Mecânico',
  Cleber: 'Mecânico',
  Getulio: 'Mecânico',
  Braga: 'Eletricista',
  Emerson: 'Eletricista',
  Miro: 'Eletricista',
  Pepeu: 'Utilidades',
  Josian: 'Utilidades',
}

const btnOrdenarData = document.getElementById('btnOrdenarData')
const btnOrdenarNome = document.getElementById('btnOrdenarNome')
const btnOrdenarFuncao = document.getElementById('btnOrdenarFuncao')
const btnOrdenarOcorrencia = document.getElementById('btnOrdenarOcorrencia')
const btnOrdenarStatus = document.getElementById('btnOrdenarStatus')

btnOrdenarData.addEventListener('click', () => {
  const listaOrdenada = [...itens].sort((a, b) => {
    const [diaA, mesA, anoA] = a.data.split('/')
    const [diaB, mesB, anoB] = b.data.split('/')

    const dataHoraA = new Date(`${anoA}-${mesA}-${diaA}T${a.hora}`)
    const dataHoraB = new Date(`${anoB}-${mesB}-${diaB}T${b.hora}`)

    return dataHoraA - dataHoraB
  })
  loadItens(listaOrdenada)
})

btnOrdenarNome.addEventListener('click', () => {
  const listaOrdenada = [...itens].sort((a, b) => a.nome.localeCompare(b.nome))
  loadItens(listaOrdenada)
})

btnOrdenarFuncao.addEventListener('click', () => {
  const listaOrdenada = [...itens].sort((a, b) =>
    a.funcao.localeCompare(b.funcao)
  )
  loadItens(listaOrdenada)
})

btnOrdenarOcorrencia.addEventListener('click', () => {
  const listaOrdenada = [...itens].sort((a, b) => {
    return a.salario.localeCompare(b.salario) // "salario" = ocorrência
  })
  loadItens(listaOrdenada)
})

btnOrdenarStatus.addEventListener('click', () => {
  const listaOrdenada = [...itens].sort((a, b) => {
    return a.status.localeCompare(b.status) // "status" = ocorrência
  })
  loadItens(listaOrdenada)
})

const nomeSelect = document.getElementById('m-nome')
const funcaoSelect = document.getElementById('m-funcao')

nomeSelect.addEventListener('change', () => {
  const nomeSelecionado = nomeSelect.value
  const funcaoCorrespondente = nomeParaFuncao[nomeSelecionado]

  if (funcaoCorrespondente) {
    for (let option of funcaoSelect.options) {
      if (option.value === funcaoCorrespondente) {
        option.selected = true
        break
      }
    }
  }
})

itens = getItensBD()
btnOrdenarData.click()
loadItens()
