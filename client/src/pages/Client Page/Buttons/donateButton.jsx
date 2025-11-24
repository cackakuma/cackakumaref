const DonateButton = ({style, data}) => {
  return (
    <>
    <div className={style}>
     <button className="border-none ">
       {data.toUpperCase()}
     </button>
    </div>
    </>
  )
};

export default DonateButton;