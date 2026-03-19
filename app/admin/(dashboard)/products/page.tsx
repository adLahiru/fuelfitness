'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Product } from '@/types/store';

function ProductForm({ product, onSave, onCancel }: { product: Partial<Product>; onSave: (p: Partial<Product>) => void; onCancel: () => void }) {
  const [data, setData] = useState(product);
  const update = (field: string, value: string | number) => setData((d) => ({ ...d, [field]: value }));

  return (
    <div className="max-w-2xl mx-auto bg-background-secondary border border-border p-8">
      <h2 className="text-2xl font-heading font-bold text-white mb-6 border-b border-border pb-4">
        {data.id ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
      </h2>
      <form onSubmit={(e) => { e.preventDefault(); onSave(data); }} className="space-y-4">
        <Input label="Product Name" value={data.name || ''} onChange={(e) => update('name', e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price ($)" type="number" step="0.01" value={data.price || ''} onChange={(e) => update('price', parseFloat(e.target.value))} required />
          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Category</label>
            <select
              className="w-full bg-background-secondary border border-border px-4 py-3 text-text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon"
              value={data.category || ''}
              onChange={(e) => update('category', e.target.value)}
            >
              <option value="Protein">Protein</option>
              <option value="Pre-Workout">Pre-Workout</option>
              <option value="Creatine">Creatine</option>
              <option value="Vitamins">Vitamins</option>
              <option value="Amino Acids">Amino Acids</option>
            </select>
          </div>
        </div>
        <Input label="Brand" value={data.brand || ''} onChange={(e) => update('brand', e.target.value)} required />
        <Input label="Image URL" value={data.image || ''} onChange={(e) => update('image', e.target.value)} required />
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">Description</label>
          <textarea
            className="w-full bg-background-secondary border border-border px-4 py-3 text-text-primary focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon min-h-[100px]"
            value={data.description || ''}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>
        <div className="flex gap-4 pt-4 border-t border-border mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>CANCEL</Button>
          <Button type="submit" className="flex-1">SAVE PRODUCT</Button>
        </div>
      </form>
    </div>
  );
}

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => { setCurrentProduct(product); setIsEditing(true); };
  const handleAddNew = () => {
    setCurrentProduct({ name: '', category: 'Protein', price: 0, rating: 5.0, reviews: 0, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800', brand: 'NEXUS', description: '' });
    setIsEditing(true);
  };

  const handleSave = (data: Partial<Product>) => {
    if (data.id) { updateProduct(data.id, data); } else { addProduct(data as Omit<Product, 'id'>); }
    setIsEditing(false);
  };

  if (isEditing) {
    return <ProductForm product={currentProduct} onSave={handleSave} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">PRODUCTS</h1>
          <p className="text-text-secondary">Manage your store inventory.</p>
        </div>
        <Button onClick={handleAddNew}><Plus className="w-4 h-4 mr-2" /> ADD PRODUCT</Button>
      </div>

      <div className="bg-background-secondary border border-border p-6">
        <div className="mb-6 max-w-md">
          <Input placeholder="Search products..." icon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-border">
                <th className="pb-3 font-medium w-16">Image</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-background/50 transition-colors">
                  <td className="py-3"><img src={product.image} alt={product.name} className="w-10 h-10 object-contain bg-background p-1" /></td>
                  <td className="py-3 font-medium text-white">{product.name}</td>
                  <td className="py-3 text-text-secondary">{product.category}</td>
                  <td className="py-3 font-bold text-neon">${product.price.toFixed(2)}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 text-text-secondary hover:text-white transition-colors cursor-pointer" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => { if (window.confirm('Are you sure you want to delete this product?')) deleteProduct(product.id); }} className="p-2 text-text-secondary hover:text-status-warning transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-text-secondary">No products found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
