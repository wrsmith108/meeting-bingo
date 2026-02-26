import { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface Props {
  onSelect: (categoryId: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Choose Your Buzzword Pack
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {CATEGORIES.map(category => (
            <Card key={category.id} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{category.description}</p>
              <p className="text-xs text-gray-400 mb-4">
                {category.words.slice(0, 4).join(', ')}...
              </p>
              <Button onClick={() => onSelect(category.id)} className="w-full">
                Select
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
