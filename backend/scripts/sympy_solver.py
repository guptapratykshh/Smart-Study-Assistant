#!/usr/bin/env python3
"""
SymPy Math Solver
Solves complex mathematical problems using SymPy library
"""

import sys
import json
import re as regex_module
from sympy import *
from sympy.parsing.sympy_parser import parse_expr

def solve_math_problem(problem):
    """
    Attempts to solve a math problem using SymPy
    Returns a JSON object with answer and explanation
    """
    problem_lower = problem.lower()
    
    # Initialize symbols
    x, y, z = symbols('x y z')
    
    try:
        # Handle calculus operations
        if 'integrate' in problem_lower or 'integral' in problem_lower:
            # Extract expression to integrate
            expr_match = regex_module.search(r'(?:integrate|integral)\s+([^,]+)', problem_lower)
            if expr_match:
                expr_str = expr_match.group(1).strip()
                # Clean expression: handle implicit multiplication and convert ^ to **
                expr_str = regex_module.sub(r'(\d)([a-z])', r'\1*\2', expr_str)  # 5x -> 5*x
                expr_str = expr_str.replace(' ', '').replace('^', '**')
                try:
                    expr = parse_expr(expr_str)
                    integral = integrate(expr, x)
                    return {
                        "success": True,
                        "answer": str(integral),
                        "explanation": f"Integrating {expr_str} with respect to x:\n\n∫ {expr} dx = {integral}\n\nThis is the antiderivative of the expression."
                    }
                except:
                    pass
        
        if 'differentiate' in problem_lower or 'derivative' in problem_lower:
            # Extract expression to differentiate
            expr_match = regex_module.search(r'(?:differentiate|derivative)\s+([^,]+)', problem_lower)
            if expr_match:
                expr_str = expr_match.group(1).strip()
                # Clean expression
                expr_str = regex_module.sub(r'(\d)([a-z])', r'\1*\2', expr_str)  # 5x -> 5*x
                expr_str = expr_str.replace(' ', '').replace('^', '**')
                try:
                    expr = parse_expr(expr_str)
                    derivative = diff(expr, x)
                    return {
                        "success": True,
                        "answer": str(derivative),
                        "explanation": f"Differentiating {expr_str} with respect to x:\n\nd/dx ({expr}) = {derivative}\n\nThis is the derivative of the expression."
                    }
                except:
                    pass
        
        # Try to extract and solve equations
        if '=' in problem:
            # Extract equation (look for pattern: expression = expression)
            equation_match = regex_module.search(r'([^=]+)=([^=]+)', problem)
            if equation_match:
                left = equation_match.group(1).strip()
                right = equation_match.group(2).strip()
                
                # Remove "solve" keyword if present
                left = regex_module.sub(r'^\s*solve\s+', '', left, flags=regex_module.IGNORECASE).strip()
                
                try:
                    # Clean and parse expressions - handle implicit multiplication
                    # Convert patterns like "5x" to "5*x", "x^2" to "x**2"
                    left_clean = regex_module.sub(r'(\d)([a-z])', r'\1*\2', left)  # 5x -> 5*x
                    left_clean = left_clean.replace(' ', '').replace('^', '**')
                    
                    right_clean = regex_module.sub(r'(\d)([a-z])', r'\1*\2', right)  # 5x -> 5*x
                    right_clean = right_clean.replace(' ', '').replace('^', '**')
                    
                    left_expr = parse_expr(left_clean)
                    right_expr = parse_expr(right_clean)
                    equation = Eq(left_expr, right_expr)
                    solution = solve(equation, x)
                    
                    return {
                        "success": True,
                        "answer": str(solution),
                        "explanation": f"Solving the equation {left} = {right}:\n\nWe rearrange to get: {equation}\n\nSolution: x = {solution}\n\nThis means the value(s) of x that satisfy the equation."
                    }
                except Exception as e:
                    # If parsing fails, try to extract just the expression part
                    pass
        
        # Try to evaluate expressions (only if no equation was found)
        if any(op in problem for op in ['+', '-', '*', '/', '^', '**', 'sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'exp']):
            # Extract mathematical expression - look for actual math expressions
            # Pattern: numbers, operators, parentheses, functions
            expr_pattern = r'([\d+\-*/().\sx^]+|sqrt\([^)]+\)|sin\([^)]+\)|cos\([^)]+\)|tan\([^)]+\)|log\([^)]+\)|ln\([^)]+\)|exp\([^)]+\))'
            expr_match = regex_module.search(expr_pattern, problem)
            if expr_match:
                expr_str = expr_match.group(1).strip()
                # Remove "solve" keyword if present
                expr_str = regex_module.sub(r'^\s*solve\s+', '', expr_str, flags=regex_module.IGNORECASE).strip()
                # Clean expression
                expr_str = expr_str.replace('^', '**').replace(' ', '')
                
                # Only try if it looks like a valid expression
                if regex_module.match(r'^[\d+\-*/().x]+$', expr_str) or any(func in expr_str for func in ['sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'exp']):
                    try:
                        expr = parse_expr(expr_str)
                        result = expr.evalf()
                        
                        return {
                            "success": True,
                            "answer": str(result),
                            "explanation": f"Evaluating the expression: {expr_str}\n\nUsing SymPy to compute: {expr}\n\nResult: {result}\n\nThis is the numerical value of the expression."
                        }
                    except Exception as e:
                        pass
        
        # For algorithmic complexity questions, return a structured response
        if any(keyword in problem_lower for keyword in ['time complexity', 'space complexity', 'big o', 'algorithm', 'worst-case', 'best-case']):
            return {
                "success": True,
                "answer": "This requires algorithmic analysis, not symbolic math",
                "explanation": "This is an algorithmic complexity question that requires understanding of data structures and algorithms, not symbolic mathematics. The answer should be determined through algorithm analysis."
            }
        
        # Default: return that we need more context
        return {
            "success": False,
            "answer": "Unable to solve with SymPy",
            "explanation": "The problem could not be automatically solved with SymPy. This might require human reasoning or AI assistance."
        }
        
    except Exception as e:
        return {
            "success": False,
            "answer": f"Error: {str(e)}",
            "explanation": f"SymPy encountered an error while trying to solve the problem: {str(e)}"
        }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "answer": "No problem provided",
            "explanation": "Please provide a math problem as an argument"
        }))
        sys.exit(1)
    
    problem = ' '.join(sys.argv[1:])
    result = solve_math_problem(problem)
    print(json.dumps(result))

if __name__ == '__main__':
    main()

