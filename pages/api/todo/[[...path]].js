export default async function todo (request, response){
  const {path} = request.query;
  const id = path[0];

  // console.log('****', {id});


  //Не нашла на верселе вкладку versel/postgress 
  // соответсвенно не могу добавить импорт neon from @neondatabase/serverless и добавить const sql.
  // const rows = await sql `SELECT * from todo`;

    response.status(200).json(
        // rows
    
        [
            {
              "id": 2,
              "checked": false,
              "text": "Почитать книгу"
            },
            {
              "id": 3,
              "checked": false,
              "text": "Сходить в магазин"
            },
            {
              "text": "Почистить память",
              "id": 4,
              "checked": false
            },
            {
              "text": "Постирать вещи",
              "id": 5,
              "checked": false
            }
          ]
    );
}