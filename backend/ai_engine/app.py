from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from agent_factory import create_agent, run_agent

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

PORT = int(os.getenv('PORT', 5001))

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "ai-engine", "framework": "agno"})

@app.route('/api/agno/agent', methods=['POST'])
def create_run_agent():
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Create and run an ephemeral agent
        agent = create_agent()
        response = run_agent(agent, prompt)

        return jsonify({
            "status": "success",
            "response": response
        })

    except Exception as e:
        print(f"Error in execution: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print(f"🚀 AI Engine (Agno+Flask) running on port {PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=True)
