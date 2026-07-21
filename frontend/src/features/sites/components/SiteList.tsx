import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { ColumnFilter } from '@/components/ui/ColumnFilter';
import { useSites, useCreateSite, useUpdateSite, useDeleteSite, useSiteOptions } from '../hooks/useSites';
import { Site } from '../types';
import { SiteFormModal } from './SiteFormModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { SiteFormData } from '../validation';
import { Pagination } from '@/components/ui/Pagination';
import { Tooltip } from '@/components/ui/Tooltip';
import { TableSkeleton } from '@/components/ui/TableSkeleton';
import { Pencil, Trash2, Building2, Plus, X } from 'lucide-react';

export const SiteList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState({ site_name: '', location: '', status: '' });
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters]);

  const { data: response, isLoading, isError } = useSites(page, limit, debouncedFilters);
  const sites = response?.data;
  const meta = response?.meta;
  const { data: siteOptionsData } = useSiteOptions();
  const createMutation = useCreateSite();
  const updateMutation = useUpdateSite();
  const deleteMutation = useDeleteSite();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | undefined>(undefined);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);

  const handleOpenCreate = () => {
    setSelectedSite(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (site: Site) => {
    setSelectedSite(site);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (site: Site) => {
    setSiteToDelete(site);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: SiteFormData) => {
    if (selectedSite) {
      updateMutation.mutateAsync({ id: selectedSite.id, data }, {
        onSuccess: () => setIsFormOpen(false)
      });
    } else {
      createMutation.mutateAsync(data, {
        onSuccess: () => setIsFormOpen(false)
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (siteToDelete) {
      deleteMutation.mutateAsync(siteToDelete.id, {
        onSuccess: () => setIsDeleteOpen(false)
      });
    }
  };



  const getFilterOptions = (options: Record<string, unknown>[], labelKey: string, valueKey: string) => {
    if (!options) return [{ label: 'All', value: '' }];
    const uniqueValues = new Set<string>();
    const mapped = options.reduce((acc, opt) => {
      const val = opt[valueKey];
      if (val && !uniqueValues.has(val)) {
        uniqueValues.add(val);
        acc.push({ label: opt[labelKey], value: val });
      }
      return acc;
    }, [] as { label: string, value: string }[]);
    return [{ label: 'All', value: '' }, ...mapped.sort((a, b) => a.label.localeCompare(b.label))];
  };

  const siteNameOptions = getFilterOptions(siteOptionsData || [], 'site_name', 'site_name');
  const locationOptions = getFilterOptions(siteOptionsData || [], 'location', 'location');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6 shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sites</h2>
            <p className="text-sm text-gray-500">Manage physical locations</p>
          </div>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          {Object.values(filters).some(val => val !== '') && (
            <button
              onClick={() => setFilters({ site_name: '', location: '', status: '' })}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition font-medium text-sm"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold shadow-sm"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Add </span>Site
          </button>
        </div>
      </div>

      <div className="bg-white border-y border-gray-200 flex flex-col flex-1 overflow-hidden">
        {isLoading ? (
          <TableSkeleton columns={4} />
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-red-500 p-8">Failed to load sites.</div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto scrollbar-thin">
              <table className="w-full text-sm text-left text-gray-500 relative">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[35%]">
                      <div className="flex items-center">
                        Site Name
                        <ColumnFilter
                          value={filters.site_name}
                          onChange={(val) => setFilters(prev => ({ ...prev, site_name: val }))}
                          type="select"
                          options={siteNameOptions}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[40%]">
                      <div className="flex items-center">
                        Location
                        <ColumnFilter
                          value={filters.location}
                          onChange={(val) => setFilters(prev => ({ ...prev, location: val }))}
                          type="select"
                          options={locationOptions}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 border-b border-gray-100 w-[15%]">
                      <div className="flex items-center">
                        Status
                        <ColumnFilter
                          value={filters.status}
                          onChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
                          type="select"
                          options={[
                            { label: 'All', value: '' },
                            { label: 'Active', value: 'true' },
                            { label: 'Inactive', value: 'false' },
                          ]}
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-2 text-right border-b border-gray-100 w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(!sites || sites.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-500">
                        No sites found.
                      </td>
                    </tr>
                  ) : (
                    sites.map((site) => (
                      <tr key={site.id} className="bg-white border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                          {site.site_name}
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {site.location || 'N/A'}
                        </td>
                        <td className="px-4 py-2">
                          {site.is_active ? (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full border border-green-200">Active</span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full border border-red-200">Inactive</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <Tooltip content="Edit" position="top">
                            <button
                              onClick={() => handleOpenEdit(site)}
                              className="p-1.5 font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition"
                            >
                              <Pencil size={16} />
                            </button>
                          </Tooltip>
                          <Tooltip content="Delete" position="top">
                            <button
                              onClick={() => handleOpenDelete(site)}
                              className="p-1.5 font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {meta && (
              <div className="shrink-0 bg-white">
                <Pagination
                  page={page}
                  totalPages={meta.totalPages}
                  onPageChange={setPage}
                  limit={limit}
                  onLimitChange={setLimit}
                  totalItems={meta.total}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <SiteFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        site={selectedSite}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Site"
        message={`Are you sure you want to delete ${siteToDelete?.site_name}? Departments assigned to this site might prevent deletion.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};
