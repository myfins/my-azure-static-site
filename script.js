async function loadData(type) {
  document.getElementById("content").innerHTML = `<h2>${type.toUpperCase()}</h2><p>Loading data...</p>`;

  try {
    const response = await fetch(`/api/getData?type=${type}`);
    const data = await response.json();

    let html = `<h2>${type.toUpperCase()} Data</h2><ul>`;
    data.forEach(item => {
      html += `<li>${item.name}: ${item.value}</li>`;
    });
    html += "</ul>";
    document.getElementById("content").innerHTML = html;
  } catch (error) {
    document.getElementById("content").innerHTML = `<p style="color:red;">Error loading data: ${error}</p>`;
  }
}
