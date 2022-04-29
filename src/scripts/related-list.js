export const renderRelated = (related) => {
    const el = document.getElementById('related-chart')
    el.insertAdjacentHTML('afterbegin', related
        .map(item => `
            <li>
                <a href="">
                    ${item}
                    <span>200 searches</span>
                </a>
            </li>
        `)
        .join('')
    )
}