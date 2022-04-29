import { destroyCharts, renderLinearChart, renderCountryChart } from './chart.js'
import { renderRelated } from './related-list.js'
import { data } from '../data'

export const getDataByURL = async (url) => {
    try{
        const response = await fetch(url) 
        if (response.status !== 200) throw 'Error in API'
        return await response.json()
    }catch(err){
        return { err }
    }
}

export const formatHistories = (histories) => histories
    .map(history => {
        const date = new Date(`${history.date} 00:00:00`)
        return {
            value: history.count,
            date: date.getTime(),
            dateStr: date.toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })
        }
    })

export const API_URL = '/trends/graph/?term='

export const initModals = () => {
    const modalCloseBtns = [...document.querySelectorAll('[data-modal-close]')]
    modalCloseBtns
        .forEach(btn => {
            btn.onclick = () => handleModal(btn.parentNode.parentNode.id)
        })
}

export const handleModal = (id, action) => {
    const modal = document.getElementById(id)
    if (!modal) return
    const fn = action === 'show' ? 'add' : 'remove'
    document.body.classList[fn]('on-modal')
    modal.classList[fn]('active')
}

export const handleLoader = (id, action) => {
    const chart = document.getElementById(id)
    if (!chart) return
    const fn = action === 'show' ? 'add' : 'remove'
    chart.classList[fn]('is-loading')
}

export const initSearch = () => {
    const form = document.getElementById('search-form')
    if (!form) return
    const input = form.querySelector('input')
    if (!input) return

    form.onsubmit = async (e) => {
        e.preventDefault()
        await loadContent(`${API_URL}${input.value}`)
    }
}

export const loadContent = async (url) => {
    handleLoader('linear-chart-wr', 'show')
    handleLoader('related-chart', 'show')
    handleLoader('country-chart-wr', 'show')

    const { err, countries, data, related } = await getDataByURL(url)

    if (!err){
        destroyCharts()
        renderLinearChart('linear-chart', formatHistories(data))
        renderRelated(related)
        renderCountryChart('country-chart', countries)
    }else{
        handleModal('error-modal', 'show')
        console.error(err)
    }

    handleLoader('linear-chart-wr', 'hide')
    handleLoader('related-chart', 'hide')
    handleLoader('country-chart-wr', 'hide')
}

export const init = () => {
    initModals()
    initSearch()

    loadContent(`${API_URL}smith`) // TODO: update url to fetch
}