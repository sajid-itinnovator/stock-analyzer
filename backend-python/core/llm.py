from typing import Optional
import sys

async def call_llm(provider: str, api_key: str, model: str, system_prompt: str, user_prompt: str) -> str:
    """Centralized LLM Caller"""
    
    try:
        if provider == 'openai':
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model=model or "gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            return response.choices[0].message.content
        
        elif provider == 'anthropic':
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)
            message = client.messages.create(
                model=model or "claude-3-opas-20240229",
                max_tokens=1024,
                messages=[
                   {"role": "user", "content": f"{system_prompt}\n\n{user_prompt}"}
                ]
            )
            return message.content[0].text
        
        elif provider == 'google':
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model_instance = genai.GenerativeModel(model or 'gemini-pro')
            response = model_instance.generate_content(f"{system_prompt}\n\n{user_prompt}")
            return response.text
            
        return "Error: Unsupported provider or missing library."
        
    except Exception as e:
        print(f"LLM Error: {e}")
        return f"AI Analysis failed: {str(e)}"
