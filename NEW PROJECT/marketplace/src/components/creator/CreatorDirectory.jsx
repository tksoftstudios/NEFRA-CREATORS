import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Avatar,
  Space,
  Row,
  Col,
  Rate,
  Divider,
  message
} from 'antd';
import {
  CrownOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  ThunderboltFilled,
  YoutubeFilled,
  SendOutlined,
  CheckCircleFilled,
  GlobalOutlined
} from '@ant-design/icons';
import { TOP_10_CREATORS, INITIAL_RATE_CARDS } from '../../data/mockData';

export default function CreatorDirectory() {
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreator = (creator) => {
    setSelectedCreator(creator);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 70,
      render: (rank) => (
        <div className="flex items-center justify-center font-bold font-mono">
          {rank === 1 ? (
            <CrownOutlined className="text-amber-400 text-lg" />
          ) : rank === 2 ? (
            <span className="text-slate-300">#2</span>
          ) : rank === 3 ? (
            <span className="text-amber-600">#3</span>
          ) : (
            <span className="text-slate-500">#{rank}</span>
          )}
        </div>
      )
    },
    {
      title: 'Creator',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.avatar}
            size={42}
            className="border border-indigo-400/40"
          />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
              <span>{record.name}</span>
              <CheckCircleFilled className="text-blue-400 text-xs" />
            </div>
            <span className="text-xs text-indigo-400">{record.handle}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Niche / Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="purple" className="border-purple-500/30 text-xs">
          {category}
        </Tag>
      )
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (country) => (
        <span className="text-xs text-slate-300 flex items-center gap-1">
          <GlobalOutlined className="text-slate-500" /> {country}
        </span>
      )
    },
    {
      title: 'YouTube Reach',
      dataIndex: 'subscribers',
      key: 'subscribers',
      render: (_, record) => (
        <div className="text-xs">
          <div className="font-bold text-white font-mono flex items-center gap-1">
            <YoutubeFilled className="text-red-500" /> {record.subscribers}
          </div>
          <span className="text-slate-500 text-[11px]">Avg {record.avgViews} views</span>
        </div>
      )
    },
    {
      title: 'Safety Score',
      dataIndex: 'safetyScore',
      key: 'safetyScore',
      render: (score) => (
        <Tag color="cyan" className="font-mono text-xs">
          {score}% AAA
        </Tag>
      )
    },
    {
      title: 'Starting Rate',
      dataIndex: 'startingPrice',
      key: 'startingPrice',
      render: (price) => (
        <span className="font-bold text-emerald-400 font-mono text-sm">
          {price}
        </span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          size="small"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleOpenCreator(record)}
          className="bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold"
        >
          View Rate Card
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Verified YouTube Creator Directory</span>
            <Tag color="gold">Top 10 Leaderboard</Tag>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Pre-vetted YouTube partners with algorithmic brand safety scores and fixed rate cards.
          </p>
        </div>
      </div>

      {/* AntD Table */}
      <Card className="bg-slate-900/90 border-slate-800 shadow-2xl p-0 overflow-hidden">
        <Table
          columns={columns}
          dataSource={TOP_10_CREATORS}
          rowKey="rank"
          pagination={false}
          className="dark-table"
        />
      </Card>

      {/* Creator Detail & Rate Card AntD Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={720}
        destroyOnClose
        className="dark-modal"
      >
        {selectedCreator && (
          <div className="space-y-4 mt-2">
            {/* Modal Header */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <Avatar
                src={selectedCreator.avatar}
                size={64}
                className="border-2 border-indigo-400"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {selectedCreator.name}
                  </h3>
                  <CheckCircleFilled className="text-blue-400" />
                  <Tag color="purple">{selectedCreator.category}</Tag>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{selectedCreator.handle}</span>
                  <span>•</span>
                  <span>{selectedCreator.country}</span>
                  <span>•</span>
                  <span className="text-red-400 flex items-center gap-1">
                    <YoutubeFilled /> {selectedCreator.subscribers} Subscribers
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Safety Grade</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">
                  {selectedCreator.safetyScore}% AAA
                </span>
              </div>
            </div>

            {/* Specialties */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Specialties:</span>
              {selectedCreator.specialties.map((s, i) => (
                <Tag key={i} color="default" className="bg-slate-800 text-slate-300 border-slate-700">
                  {s}
                </Tag>
              ))}
            </div>

            <Divider className="border-slate-800 my-2" />

            {/* Rate Card Packages for this creator */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3">
                Rate Card Packages & Escrow Orders
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {INITIAL_RATE_CARDS.map(card => (
                  <div
                    key={card.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {card.title}
                      </span>
                      <span className="text-lg font-bold text-emerald-400 font-mono block mt-1">
                        ${card.price.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {card.turnaroundDays}d turnaround • {card.revisions} rev
                      </span>
                    </div>

                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        message.success(
                          `Escrow order initiated for ${selectedCreator.name} - ${card.title}!`
                        );
                        setIsModalOpen(false);
                      }}
                      className="mt-3 bg-indigo-600 hover:bg-indigo-500 text-xs w-full font-semibold"
                    >
                      Instant Escrow Gig
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => {
                  message.success(`Campaign invitation sent to ${selectedCreator.name}!`);
                  setIsModalOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 font-semibold"
              >
                Invite to Campaign
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
