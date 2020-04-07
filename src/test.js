let a = [{
    name: 'user-1',
    score: Math.round(Math.random()*100)
},
{
    name: 'user-2',
    score: Math.round(Math.random()*100)
},
{
    name: 'user-3',
    score: Math.round(Math.random()*100)
},
{
    name: 'user-4',
    score: Math.round(Math.random()*100)
},
{
    name: 'user-5',
    score: Math.round(Math.random()*100)
}];

a.sort((a,b) => (b.score - a.score))
console.log(JSON.stringify(a, null, 2))