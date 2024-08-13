from flask import Flask, request, jsonify
from transformers import pipeline
import os

# initialize Flask application
app = Flask(__name__)
# initialize Hugging Face summarization pipeline
summarizer = pipeline('summarization', model='facebook/bart-large')

# define route to handle POST requests to '/summarize'
@app.route('/summarize', methods=['POST'])
def summarize():
    # get JSON data from request
    data = request.get_json()
    if 'content' not in data: # error handling
        return jsonify({'error': 'No content provided'}), 400
    
    print('Received content:', data['content'])
    
    try:
        # get the summary text
        summary = summarizer(data['content'], max_length=150, min_length=30, do_sample=False)
        summarized_text = summary[0]['summary_text']
        return jsonify({'summary': summarized_text}), 200
    except Exception as e: # error handling
        return jsonify({'error': str(e)}), 500

# run Flask app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(port=port)






