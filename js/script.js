const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
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

  if (edit) {
    sNome.value = itens[index].nome
    sFuncao.value = itens[index].funcao
    sSalario.value = itens[index].salario
    id = index
  } else {
    sNome.value = ''
    sFuncao.value = ''
    sSalario.value = ''
  }
}

function editItem(index) {
  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  const partes = item.data.split('/')
  const dataFormatada = `${partes[0]}/${partes[1]}/${partes[2].slice(-2)}`

  const nome = item.nome.trim().toLowerCase()
  let estiloLinha = ''

  switch (nome) {
    case 'walter':
      estiloLinha = 'background-color: #f8d7da;' // vermelho claro
      break
    case 'cleber':
      estiloLinha = 'background-color: #cce5ff;' // azul claro
      break
    case 'getulio':
      estiloLinha = 'background-color: #d4edda;' // verde claro
      break
    case 'braga':
      estiloLinha = 'background-color: #ffe5b4;' // abóbora claro
      break
    case 'emerson':
      estiloLinha = 'background-color: #e2e3e5;' // cinza claro
      break
    case 'miro':
      estiloLinha = 'background-color: #000000; color: white;' // preto com texto branco
      break
    case 'pepeu':
      estiloLinha = 'background-color: #e6ccff;' // roxo claro
      break
    case 'josian':
      estiloLinha = 'background-color: #fff3cd;' // amarelo claro
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

  tr.innerHTML = `
    <td class="dataHora">
      ${dataFormatada}<br>
      ${item.hora}
    </td>
    <td class="nomes">${item.nome}</td>
    <td class="funcao" ${funcaoStyle}>${item.funcao}</td>
    <td>${item.salario}</td>
    <td class="acaoDuplo">
      <button onclick="editItem(${index})">
        <i class='bx bx-edit'></i>
      </button>
    </td>
    <td class="acaoDuplo">
      <button onclick="deleteItem(${index})">
        <i class='bx bx-trash'></i>
      </button>
    </td>
  `

  tbody.appendChild(tr)
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
    itens[id].nome = sNome.value
    itens[id].funcao = sFuncao.value
    itens[id].salario = sSalario.value
    itens[id].data = dataBrasil
    itens[id].hora = horaBrasil
  } else {
    itens.push({
      nome: sNome.value,
      funcao: sFuncao.value,
      salario: sSalario.value,
      data: dataBrasil,
      hora: horaBrasil,
    })
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

const nomeParaFuncao = {
  Walter: 'Mecânico',
  Cleber: 'Mecânico',
  Getulio: 'Mecânico',
  Braga: 'Eletricista',
  Emerson: 'Eletricista',
  Miro: 'Eletricista',
  Pepeu: 'Utilidades',
  Josian: 'Utilidades',
}

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

loadItens()
