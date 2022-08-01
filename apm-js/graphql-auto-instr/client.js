const GRAPHQL_SERVER = "http://localhost:9000/" // change the port accordingly

async function fetchJekGreeting() {
    const response = await fetch(GRAPHQL_SERVER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                query {
                    jekGreeting
                }
            `
        }),
    })

    const { data } = await response.json()

    return data
}

const element = document.getElementById('greeting');
element.textContent = 'Loading...';
fetchJekGreeting().then(({ jekGreeting }) => {
  element.textContent = jekGreeting;
});