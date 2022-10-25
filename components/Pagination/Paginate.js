const Paginate = ({totalPages, postsPerPage,setcurrPage}) => {
  let pages = [];
  console.log(totalPages)
  for (let i = 1; i <= Math.ceil(totalPages / postsPerPage); i++) {
    pages.push(i);
  }
 console.log(pages.length)
  return(
    <div>
      {pages.map((page,index) => (
        
       <button key={index} onClick={()=>setcurrPage(page)}>{page}</button>
      ))}
    </div>
  )
};

export default Paginate;
