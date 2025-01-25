//src/components/debug/TypeScriptDebug.tsx
import React, { useEffect, useState } from 'react';

interface DebugProps<T> {
  data: T;
  component: React.ComponentType<T>;
}

interface TypeInfo {
  name: string;
  type: string;
  isOptional: boolean;
  value: any;
}

function getTypeInfo(value: any): TypeInfo[] {
  const result: TypeInfo[] = [];
  
  Object.entries(value).forEach(([key, val]) => {
    result.push({
      name: key,
      type: typeof val,
      isOptional: val === undefined,
      value: val
    });
  });

  return result;
}

export function TypeScriptDebugger<T extends object>({ data, component: Component }: DebugProps<T>) {
  const [showDebug, setShowDebug] = useState(false);
  const [typeInfo, setTypeInfo] = useState<TypeInfo[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    try {
      setTypeInfo(getTypeInfo(data));
    } catch (error) {
      setErrors(prev => [...prev, error instanceof Error ? error.message : 'Unknown error']);
    }
  }, [data]);

  return (
    <div className="border rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">TypeScript Debug Info</h3>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
      </div>

      {showDebug && (
        <div className="space-y-4">
          {/* Type Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Props Type Information:</h4>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Property</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Optional</th>
                  <th className="text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {typeInfo.map((info, index) => (
                  <tr key={index}>
                    <td className="py-1">{info.name}</td>
                    <td className="py-1 text-blue-600">{info.type}</td>
                    <td className="py-1">{info.isOptional ? '✓' : '✗'}</td>
                    <td className="py-1 text-sm">
                      {typeof info.value === 'object' 
                        ? JSON.stringify(info.value)
                        : String(info.value)
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Type Errors:</h4>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-600">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Render the actual component */}
      <div className={showDebug ? 'mt-4 pt-4 border-t' : ''}>
        <Component {...data} />
      </div>
    </div>
  );
}

// Example usage
interface TestComponentProps {
  name: string;
  age?: number;
  onAction?: () => void;
}

export const TestComponent: React.FC<TestComponentProps> = ({ 
  name, 
  age, 
  onAction 
}) => {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h4>Name: {name}</h4>
      {age && <p>Age: {age}</p>}
      {onAction && (
        <button 
          onClick={onAction}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md"
        >
          Click Me
        </button>
      )}
    </div>
  );
};

// Example implementation
export const DebugExample: React.FC = () => {
  const testData = {
    name: 'John Doe',
    age: 30,
    onAction: () => alert('Action triggered!')
  };

  return (
    <TypeScriptDebugger
      data={testData}
      component={TestComponent}
    />
  );
};