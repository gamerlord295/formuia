type Props = {
    link: string
    img: string
    className?: string
}

const Badges = ({link, img, className} : Props) => {
    return (
        <a href={link}>
            <img src={img} className={`invert w-6 h-6 opacity-75 object-contain transition-all hover:scale-110 hover:opacity-100 ${className}`} alt="" />
        </a>
    )
}

export default Badges