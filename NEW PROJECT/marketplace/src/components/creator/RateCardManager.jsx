import React, { useState } from 'react';
import {
  Card,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Row,
  Col,
  Space,
  Divider,
  message,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  CompassOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  InfoCircleOutlined,
  ThunderboltFilled,
  VideoCameraOutlined
} from '@ant-design/icons';

export default function RateCardManager({
  rateCards,
  setRateCards,
  creator,
  setCreator
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [form] = Form.useForm();

  // Modality & Geo state
  const [residence, setResidence] = useState(creator.residence || 'Singapore');
  const [willingToTravel, setWillingToTravel] = useState(creator.willingToTravel ?? true);
  const [modalities, setModalities] = useState(creator.modalityPreference || ['online', 'hybrid']);

  const handleEdit = (card) => {
    setEditingCard(card);
    form.setFieldsValue({
      title: card.title,
      type: card.type,
      price: card.price,
      turnaroundDays: card.turnaroundDays,
      revisions: card.revisions,
      modality: card.modality,
      badge: card.badge,
      description: card.description,
      deliverables: card.deliverables.join('\n')
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCard(null);
    form.resetFields();
    form.setFieldsValue({
      turnaroundDays: 7,
      revisions: 2,
      modality: 'online',
      badge: 'New Package'
    });
    setIsModalOpen(true);
  };

  const handleModalSave = (values) => {
    const deliverablesList = values.deliverables
      ? values.deliverables.split('\n').filter(d => d.trim().length > 0)
      : [];

    if (editingCard) {
      // Update existing
      setRateCards(prev =>
        prev.map(c =>
          c.id === editingCard.id
            ? { ...c, ...values, deliverables: deliverablesList }
            : c
        )
      );
      message.success('Rate Card package updated successfully!');
    } else {
      // Add new
      const newCard = {
        id: `pkg_${Date.now()}`,
        ...values,
        deliverables: deliverablesList,
        status: 'active'
      };
      setRateCards(prev => [...prev, newCard]);
      message.success('New Rate Card package published to your profile!');
    }
    setIsModalOpen(false);
  };

  const handleSaveTravelPreferences = () => {
    setCreator(prev => ({
      ...prev,
      residence,
      willingToTravel,
      modalityPreference: modalities
    }));
    message.success('Travel & Modality preferences saved!');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Rate Card & Service Packages</span>
            <Tag color="indigo">Public Catalog</Tag>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Set fixed-rate packages that verified brands can order directly or use as campaign benchmarks.
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-lg shadow-indigo-600/30"
        >
          Add Rate Card Package
        </Button>
      </div>

      {/* Modality & Geographic Residency Preferences */}
      <Card
        className="bg-slate-900/90 border-slate-800 shadow-xl overflow-hidden"
        title={
          <div className="flex items-center gap-2 py-1 text-white">
            <CompassOutlined className="text-indigo-400" />
            <span className="font-semibold">Creator Modality & Geographic Availability</span>
          </div>
        }
      >
        <Row gutter={[24, 20]} align="middle">
          <Col xs={24} md={8}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Country / City of Residence
              </label>
              <Select
                value={residence}
                onChange={setResidence}
                className="w-full"
                options={[
                  { label: '🇸🇬 Singapore', value: 'Singapore' },
                  { label: '🇺🇸 United States (San Francisco)', value: 'United States' },
                  { label: '🇬🇧 United Kingdom (London)', value: 'United Kingdom' },
                  { label: '🇩🇪 Germany (Berlin)', value: 'Germany' },
                  { label: '🇯🇵 Japan (Tokyo)', value: 'Japan' },
                  { label: '🇨🇦 Canada (Toronto)', value: 'Canada' },
                  { label: '🇦🇺 Australia (Sydney)', value: 'Australia' }
                ]}
              />
              <span className="text-[11px] text-slate-400 block">
                Brands filter campaigns by regional timezones and legal jurisdictions.
              </span>
            </div>
          </Col>

          <Col xs={24} md={10}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Accepted Campaign Modalities
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { key: 'online', label: 'Online / Remote Video', color: 'blue' },
                  { key: 'hybrid', label: 'Hybrid (Studio Shipped Hardware)', color: 'purple' },
                  { key: 'physical', label: 'Physical (On-site Expo / Vlogs)', color: 'green' }
                ].map(item => {
                  const selected = modalities.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (selected) {
                          setModalities(modalities.filter(m => m !== item.key));
                        } else {
                          setModalities([...modalities, item.key]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selected
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {item.label} {selected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </Col>

          <Col xs={24} md={6}>
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-200">
                  Passport Ready / Travel:
                </span>
                <Switch
                  checked={willingToTravel}
                  onChange={setWillingToTravel}
                  className={willingToTravel ? 'bg-emerald-500' : 'bg-slate-700'}
                />
              </div>
              <span className="text-[11px] text-slate-400">
                {willingToTravel
                  ? 'Eligible for sponsored international brand trips & keynotes.'
                  : 'Remote-only creator production.'}
              </span>
              <Button
                size="small"
                type="primary"
                onClick={handleSaveTravelPreferences}
                className="mt-1 bg-indigo-600 hover:bg-indigo-500 text-xs"
              >
                Save Modality Settings
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Rate Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rateCards.map((card) => {
          // Platform calculation: 10% take-rate
          const platformFee = Math.round(card.price * 0.1);
          const netEarnings = card.price - platformFee;

          return (
            <Card
              key={card.id}
              className="bg-slate-900/85 border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />

              <div>
                {/* Header & Badges */}
                <div className="flex items-center justify-between mb-3">
                  <Tag color="cyan" className="font-semibold text-xs m-0">
                    {card.badge || 'Package'}
                  </Tag>
                  <Tag
                    color={
                      card.modality === 'online'
                        ? 'blue'
                        : card.modality === 'hybrid'
                        ? 'purple'
                        : 'green'
                    }
                    className="uppercase text-[10px] m-0"
                  >
                    {card.modality}
                  </Tag>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[36px]">
                  {card.description}
                </p>

                {/* Price Display */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Brand Price:</span>
                      <div className="text-2xl font-bold text-white font-mono">
                        ${card.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400">Net Creator Payout:</span>
                      <div className="text-sm font-semibold text-emerald-400 font-mono">
                        ${netEarnings.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-500">(10% escrow fee)</span>
                    </div>
                  </div>
                </div>

                {/* Key specs */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <ClockCircleOutlined className="text-indigo-400" />
                    <span>{card.turnaroundDays} Days Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                    <FileDoneOutlined className="text-indigo-400" />
                    <span>{card.revisions} Revisions</span>
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Included Deliverables:
                  </div>
                  <ul className="space-y-1.5">
                    {card.deliverables.map((deliv, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-300"
                      >
                        <CheckCircleOutlined className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
                <Button
                  block
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(card)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-medium"
                >
                  Edit Package & Price
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      <Modal
        title={
          <span className="text-white font-bold text-lg">
            {editingCard ? 'Edit Rate Card Package' : 'Create New Rate Card Package'}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
        className="dark-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSave}
          className="mt-4 space-y-3"
        >
          <Form.Item
            name="title"
            label={<span className="text-slate-300">Package Title</span>}
            rules={[{ required: true, message: 'Please enter package title' }]}
          >
            <Input
              placeholder="e.g. YouTube Shorts (60s Vertical) or 90s Integration"
              className="bg-slate-900 text-white border-slate-700"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label={<span className="text-slate-300">Format Type</span>}
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: 'YouTube Shorts (Vertical)', value: 'shorts' },
                    { label: 'Mid-Roll Integration (60-90s)', value: 'integration' },
                    { label: 'Dedicated Full Video (8-15 min)', value: 'dedicated' },
                    { label: 'Event / On-Site Appearance', value: 'event' }
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="modality"
                label={<span className="text-slate-300">Campaign Modality</span>}
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: 'Online / Remote', value: 'online' },
                    { label: 'Hybrid (Hardware demo)', value: 'hybrid' },
                    { label: 'Physical (On-site event)', value: 'physical' }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label={<span className="text-slate-300">Base Price (USD)</span>}
                rules={[{ required: true, message: 'Enter price' }]}
              >
                <InputNumber
                  min={100}
                  step={50}
                  className="w-full bg-slate-900 border-slate-700"
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="turnaroundDays"
                label={<span className="text-slate-300">Turnaround (Days)</span>}
                rules={[{ required: true }]}
              >
                <InputNumber min={1} max={60} className="w-full bg-slate-900 border-slate-700" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="revisions"
                label={<span className="text-slate-300">Included Revisions</span>}
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={10} className="w-full bg-slate-900 border-slate-700" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="badge"
            label={<span className="text-slate-300">Package Highlight Badge</span>}
          >
            <Input placeholder="e.g. Most Popular, Fast Turnaround, Maximum ROI" />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="text-slate-300">Short Description</span>}
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} placeholder="Explain the format and audience value..." />
          </Form.Item>

          <Form.Item
            name="deliverables"
            label={
              <span className="text-slate-300">
                Deliverables Checklist (1 item per line)
              </span>
            }
            rules={[{ required: true, message: 'Enter deliverables' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="1x 4K YouTube Video&#10;Pinned comment with promo link&#10;Social cross-post"
            />
          </Form.Item>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-indigo-600 hover:bg-indigo-500 font-semibold"
            >
              Save & Update Package
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
