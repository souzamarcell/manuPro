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
  const partes = item.data.split('/') // ["29", "07", "2025"]
  const dataFormatada = `${partes[0]}/${partes[1]}/${partes[2].slice(-2)}` // "29/07/25"
  tr.innerHTML = `
    <td class="dataHora">
      ${dataFormatada}<br>
      ${item.hora}
    </td>
    <td class="nomes">${item.nome}</td>
    <td class="funcao">${item.funcao}</td>
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

loadItens()
