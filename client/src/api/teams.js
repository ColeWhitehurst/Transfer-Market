export const getAllTeams = async () => {
    const res = await fetch("http://localhost:3000/api/teams");
    return res.json();
  };
  
  export const getTeamById = async (id) => {
    const res = await fetch(`http://localhost:3000/api/teams/${id}`);
    return res.json();
  };
  