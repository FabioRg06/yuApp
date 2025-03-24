const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/stats/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include'
      });
      if (!response.ok) throw new Error("Error obteniendo estadísticas");
      return await response.json();
    } catch (error) {
      console.error(error);
      return { lives: 5, lessons_completed: 0, streak: 0 }; // Valores por defecto en caso de error
    }
  };
  const handleWrongAnswer = async () => {
    await fetch("/api/stats/decrement-life/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const updatedStats = await fetchUserStats();
    return updatedStats;
  };
  