import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Solves complex math problems using SymPy (Python)
 * @param {string} problem - The math problem to solve
 * @returns {Promise<Object>} Solution with answer and explanation
 */
export async function solveWithSymPy(problem) {
  return new Promise((resolve, reject) => {
    // __dirname is backend/src/services, so go up 2 levels to backend, then into scripts
    const pythonScript = path.join(__dirname, '..', '..', 'scripts', 'sympy_solver.py');
    
    const python = spawn('python3', [pythonScript, problem]);
    
    let output = '';
    let errorOutput = '';
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        console.error('SymPy solver error:', errorOutput);
        reject(new Error(`SymPy solver failed: ${errorOutput}`));
        return;
      }
      
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (parseError) {
        console.error('Failed to parse SymPy output:', output);
        reject(new Error('SymPy returned invalid JSON'));
      }
    });
    
    python.on('error', (error) => {
      console.error('Failed to spawn Python process:', error.message);
      reject(new Error(`Python not available: ${error.message}`));
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      python.kill();
      reject(new Error('SymPy solver timeout'));
    }, 10000);
  });
}

/**
 * Checks if a problem can be solved with SymPy
 * @param {string} problem - The problem to check
 * @returns {boolean} True if SymPy can help
 */
export function canUseSymPy(problem) {
  const lowerProblem = problem.toLowerCase();
  
  // SymPy is good for:
  // - Symbolic math (equations, integrals, derivatives)
  // - Algebraic problems
  // - Calculus problems
  // - But NOT for algorithmic complexity questions (those need AI reasoning)
  
  // High-priority keywords that definitely need SymPy
  const sympyPriorityKeywords = [
    'integrate', 'integral', 'differentiate', 'derivative',
    'solve', 'equation'
  ];
  
  // Other math keywords
  const sympyKeywords = [
    'limit', 'series', 'expand', 'factor', 'simplify',
    'calculate', 'compute', 'evaluate'
  ];
  
  const complexityKeywords = [
    'time complexity', 'space complexity', 'big o', 'algorithm',
    'worst-case', 'best-case', 'asymptotic', 'o(n)', 'o(log n)',
    'array', 'search', 'sort', 'binary search', 'linear search'
  ];
  
  // Don't use SymPy for algorithmic complexity (use AI instead)
  const isComplexityQuestion = complexityKeywords.some(keyword => lowerProblem.includes(keyword));
  
  if (isComplexityQuestion) {
    return false; // Use AI for these
  }
  
  // If it has priority keywords (integrate, differentiate, solve), use SymPy
  const hasPriorityKeywords = sympyPriorityKeywords.some(keyword => lowerProblem.includes(keyword));
  if (hasPriorityKeywords) {
    return true; // Definitely use SymPy
  }
  
  // Check if it's a math problem that SymPy can handle
  const hasMathKeywords = sympyKeywords.some(keyword => lowerProblem.includes(keyword));
  const hasNumbers = /\d/.test(problem);
  const hasVariables = /[xyz]/.test(problem); // Has variables like x, y, z
  
  // Use SymPy if it has math keywords and (numbers or variables)
  return hasMathKeywords && (hasNumbers || hasVariables);
}

