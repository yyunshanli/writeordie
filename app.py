from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)
summarizer = pipeline('summarization')

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    if 'content' not in data:
        return jsonify({'error': 'No content provided'}), 400
    
    # Print the received content to the terminal
    print('Received content:', data['content'])
    
    try:
        # Get the summary text
        summary = summarizer(data['content'], max_length=150, min_length=30, do_sample=False)
        summarized_text = summary[0]['summary_text']
        return jsonify({'summary': summarized_text}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)






