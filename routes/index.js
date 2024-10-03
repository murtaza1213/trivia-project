const express = require('express');
const axios = require('axios');
const router = express.Router();

let q_data = [];
let questionIndex = 0;
let score = 0;

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/home', async (req, res) => {
  const { amount, category, difficulty, type } = req.body;
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`;

  try {

    const response = await axios.get(url);

    q_data = response.data.results;
    questionIndex = 0;
    score = 0;

    res.redirect('/quiz');

  }
  catch (err) {
    console.log(err);
    res.send("Error")
  }
});

router.get('/quiz', (req, res) => {
  if (questionIndex < q_data.length) {
    const question = q_data[questionIndex];
    res.render('quiz', { question, questionIndex, totalQuestions: q_data.length });
  }
  else {
    res.redirect('/score');
  }
});

router.post('/answer', (req, res) => {
  const { answer } = req.body;
  const correct = q_data[questionIndex].correct_answer;

  if (answer === correct) {
    score++;
  }

  questionIndex++;

  res.redirect('/quiz');
});

router.get('/score', (req, res) => {
  res.render('score', { score, totalQuestions: q_data.length });
});

module.exports = router;